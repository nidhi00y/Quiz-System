const mongoose = require("mongoose");
const Quiz = require("../models/Quiz");
const Question = require("../models/Question");
const QuizAttempt = require("../models/QuizAttempt");

exports.startQuiz = async (req, res) => {
  try {
    const { quizId, studentId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return res.status(400).json({ message: "Invalid quizId" });
    }
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ message: "Invalid studentId" });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const now = new Date();
    if (now < quiz.startTime || now > quiz.endTime) {
      return res.status(403).json({ message: "Quiz not available at this time" });
    }

    const alreadyAttempted = await QuizAttempt.findOne({ quizId, studentId });
    if (alreadyAttempted) {
      return res.status(400).json({ message: "Quiz already attempted" });
    }

    // 🔥 SUBJECT-BASED + DIFFICULTY-BASED RANDOM SELECTION
    const easyQuestions = await Question.aggregate([
      { $match: { difficulty: "easy", subject: quiz.subject } },
      { $sample: { size: quiz.easyCount } }
    ]);

    const mediumQuestions = await Question.aggregate([
      { $match: { difficulty: "medium", subject: quiz.subject } },
      { $sample: { size: quiz.mediumCount } }
    ]);

    const hardQuestions = await Question.aggregate([
      { $match: { difficulty: "hard", subject: quiz.subject } },
      { $sample: { size: quiz.hardCount } }
    ]);

    const questions = [
      ...easyQuestions,
      ...mediumQuestions,
      ...hardQuestions
    ];

    if (questions.length === 0) {
      return res.status(400).json({ message: "No questions available for this subject" });
    }

    await QuizAttempt.create({
      quizId,
      studentId,
      answers: [],
      score: 0,
      submittedAt: null
    });

    const safeQuestions = questions.map(q => ({
      _id: q._id,
      questionText: q.questionText,
      options: q.options,
      difficulty: q.difficulty,
      subject: q.subject
    }));

    res.json({
      message: "Quiz started successfully",
      subject: quiz.subject,
      totalQuestions: safeQuestions.length,
      questions: safeQuestions
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
