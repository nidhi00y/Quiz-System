const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  title: String,
  startTime: Date,
  endTime: Date,
  easyCount: Number,
  mediumCount: Number,
  hardCount: Number,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher"
  }
});

module.exports = mongoose.model("Quiz", quizSchema);
