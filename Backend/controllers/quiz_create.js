import Quiz from "../models/Quiz.js";

export const createQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.create({
      ...req.body,
      durationMinutes: Number(
        req.body.durationMinutes ?? req.body.duration ?? 0
      )
    });
    res.status(201).json({ message: "Quiz created", quiz });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
