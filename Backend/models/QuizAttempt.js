import mongoose from "mongoose";
const quizAttemptSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz"
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student"
  },
  answers: [
    {
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question"
      },
      selectedOption: Number
    }
  ],
  score: Number,
  submittedAt: Date
});

export default mongoose.model("QuizAttempt", quizAttemptSchema);
