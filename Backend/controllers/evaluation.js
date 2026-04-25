import QuizAttempt from "../models/QuizAttempt.js";
import Question from "../models/Question.js";

export const submitQuiz = async (req, res) => {
  try {
    const { quizId, answers, studentId } = req.body;


    const existingAttempt = await QuizAttempt.findOne({ quizId, studentId });
    if (!existingAttempt) {
      return res.status(400).json({ message: "Quiz attempt not found. Please start the quiz first." });
    }

    if (existingAttempt.submittedAt) {
      return res.status(400).json({ message: "Quiz already submitted" });
    }

    let score = 0;

    for (let ans of answers) {
      const question = await Question.findById(ans.questionId);

      if (question && question.correctOption === ans.selectedOption) {
        score++;
      }
    }

    existingAttempt.answers = answers;
    existingAttempt.score = score;
    existingAttempt.submittedAt = new Date();
    await existingAttempt.save();

    res.json({
      message: "Quiz submitted successfully",
      score,
      total: answers.length
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
