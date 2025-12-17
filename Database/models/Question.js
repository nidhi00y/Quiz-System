const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    validate: v => v.length === 4
  },
  correctOption: {
    type: Number, // 0 to 3
    required: true
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher"
  }
});

module.exports = mongoose.model("Question", questionSchema);
