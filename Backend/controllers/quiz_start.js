import mongoose from "mongoose";
import Quiz from "../models/Quiz.js";
import Question from "../models/Question.js";
import QuizAttempt from "../models/QuizAttempt.js";
import Student from "../models/Student.js";

export const startQuiz = async (req, res) => {
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

    const x = await Student.findById(studentId);
    const d = x ? x.department : "Computer Science"; // fallback for testing
    const q = await Quiz.findById(quizId);
    const dq = q.department;
    if (d != dq) {
      return res.status(404).json({ message: "You are not allowed to give this quiz" });
    }

    const now = new Date();
    if (now < quiz.startTime || now > quiz.endTime) {
      return res.status(403).json({ message: "Quiz not available at this time" });
    }

    const alreadyAttempted = await QuizAttempt.findOne({ quizId, studentId });
    if (alreadyAttempted) {
      return res.status(400).json({ message: "Quiz already attempted" });
    }


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
