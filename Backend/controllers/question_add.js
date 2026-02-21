const Question = require("../models/Question");

exports.addQuestion = async (req, res) => {
  try {
    const { questions } = req.body;

    if (!questions || !Array.isArray(questions)) {
      return res.status(400).json({ message: "Questions array required" });
    }

    const savedQuestions = await Question.insertMany(questions);

    res.status(201).json({
      message: "Questions added successfully",
      savedQuestions
    });

  } catch (error) {
    console.error(error);   // VERY IMPORTANT
    res.status(500).json({ message: error.message });
  }
};