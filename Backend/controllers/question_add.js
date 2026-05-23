import Question from "../models/Question.js";
import AI from "../services/ai.js"

export const addQuestion = async (req, res) => {
  try {
    const { questions } = req.body;

    // Check array exists and is not empty
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: "Questions array required and cannot be empty" });
    }

    // Validate each question manually
    for (let q of questions) {
      if (!q.questionText || !q.options || q.correctOption === undefined || !q.subject || !q.difficulty) {
        return res.status(400).json({ message: "Missing required fields in one or more questions" });
      }

      if (!Array.isArray(q.options) || q.options.length !== 4) {
        return res.status(400).json({ message: "Each question must have exactly 4 options" });
      }

      if (q.correctOption < 0 || q.correctOption > 3) {
        return res.status(400).json({ message: "correctOption must be between 0 and 3" });
      }
    }

    // Insert with partial success option
    const savedQuestions = await Question.insertMany(questions, { ordered: false });

    res.status(201).json({
      message: "Questions added successfully",
      count: savedQuestions.length,
      savedQuestions
    });

  } catch (error) {
    console.error(error);

    // Handle partial failures (important for insertMany)
    if (error.writeErrors) {
      return res.status(207).json({
        message: "Some questions failed to insert",
        errors: error.writeErrors
      });
    }

    res.status(500).json({ message: error.message });
  }
};

export const addQuestionbyAI = async(req,res) => {
  try {
    const { questions } = req.body;

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: "Questions array required and cannot be empty" });
    }

    for (let q of questions) {
      if (!q.questionText || !q.options || q.correctOption === undefined || !q.subject || !q.difficulty) {
        return res.status(400).json({ message: "Missing required fields in one or more questions" });
      }

      if (!Array.isArray(q.options) || q.options.length !== 4) {
        return res.status(400).json({ message: "Each question must have exactly 4 options" });
      }

      if (q.correctOption < 0 || q.correctOption > 3) {
        return res.status(400).json({ message: "correctOption must be between 0 and 3" });
      }
    }

    const savedQuestions = await Question.insertMany(questions, { ordered: false });

    res.status(201).json({
      message: "AI questions added successfully",
      count: savedQuestions.length,
      savedQuestions
    });
  } catch (error) {
    console.error(error);

    if (error.writeErrors) {
      return res.status(207).json({
        message: "Some questions failed to insert",
        errors: error.writeErrors
      });
    }

    res.status(500).json({ message: error.message });
  }
}