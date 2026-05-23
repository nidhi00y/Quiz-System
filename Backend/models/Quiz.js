import mongoose from "mongoose";
const quizSchema = new mongoose.Schema({
  title: String,
  startTime: Date,
  endTime: Date,
  durationMinutes: {
    type: Number,
    default: 0
  },
  department:String,
  subject:String,
  easyCount: Number,
  mediumCount: Number,
  hardCount: Number,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher"
  }
});

export default mongoose.model("Quiz", quizSchema);
