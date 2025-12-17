const Question = require("../models/Question");
const QuizAttempt = require("../models/QuizAttempt");
const Quiz = require("../models/Quiz");

exports.startQuiz = async (req, res) => {
  try {
    const { quizId } = req.body;
    const studentId = "TEST_STUDENT";

    const quiz = await Quiz.findById(quizId);
    const now = new Date();

    if (now < quiz.startTime || now > quiz.endTime) {
      return res.status(403).json({ message: "Quiz not available" });
    }

    const attempted = await QuizAttempt.findOne({ quizId, studentId });
    if (attempted) {
      return res.status(400).json({ message: "Already attempted" });
    }

    const easy = await Question.aggregate([
      { $match: { difficulty: "easy" } },
      { $sample: { size: quiz.easyCount } }
    ]);

    const medium = await Question.aggregate([
      { $match: { difficulty: "medium" } },
      { $sample: { size: quiz.mediumCount } }
    ]);

    const hard = await Question.aggregate([
      { $match: { difficulty: "hard" } },
      { $sample: { size: quiz.hardCount } }
    ]);

    const questions = [...easy, ...medium, ...hard];

    await QuizAttempt.create({ quizId, studentId });

    res.json({ questions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
