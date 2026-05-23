import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({

  title: String,

  startTime: Date,

  endTime: Date,

  durationMinutes: Number,

  department: String,

  subject: String,

  // ===== NEW TOPICS FIELD =====
  topics: {
    type: [String],
    default: []
  },

  easyCount: Number,

  mediumCount: Number,

  hardCount: Number,

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher"
  }

});

export default mongoose.model(
  "Quiz",
  quizSchema
);