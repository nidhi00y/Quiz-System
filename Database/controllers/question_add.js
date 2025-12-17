const Question = require("../models/Question");

exports.addQuestion = async (req, res) => {
  try {
    const { questionText, options, correctOption,subject, difficulty } = req.body;

    if (!questionText || !options || correctOption === undefined ||!subject|| !difficulty) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (options.length !== 4) {
      return res.status(400).json({ message: "Exactly 4 options are required" });
    }

    const question = await Question.create({
      questionText,
      options,
      correctOption,
      subject,
      difficulty
//      createdBy: req.user.id   // from JWT
    });

    res.status(201).json({
      message: "Question added successfully",
      question
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
