import Quiz from "../models/Quiz.js";

export const createQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.create(req.body);
    res.status(201).json({ message: "Quiz created", quiz });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
