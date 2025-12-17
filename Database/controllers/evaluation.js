const QuizAttempt = require("../models/QuizAttempt");
const Question = require("../models/Question");

exports.submitQuiz = async (req, res) => {
  try {
    const { quizId, answers } = req.body;
    const studentId = req.user?.id || "TEST_STUDENT_ID";

    const existingAttempt = await QuizAttempt.findOne({ quizId, studentId });
    if (existingAttempt) {
      return res.status(400).json({ message: "Quiz already submitted" });
    }

    let score = 0;

    for (let ans of answers) {
      const question = await Question.findById(ans.questionId);

      if (question && question.correctOption === ans.selectedOption) {
        score++;
      }
    }

    const attempt = await QuizAttempt.create({
      quizId,
      studentId,
      answers,
      score,
      submittedAt: new Date()
    });

    res.json({
      message: "Quiz submitted successfully",
      score,
      total: answers.length
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
