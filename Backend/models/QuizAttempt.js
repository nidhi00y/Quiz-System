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

      selectedOption: {
        type: Number,
        default: -1
      },

      // Time spent on this question in seconds
      timeTaken: {
        type: Number,
        default: 0
      },

      // Whether student skipped this question
      skipped: {
        type: Boolean,
        default: false
      }
    }
  ],

  score: {
    type: Number,
    default: 0
  },

  submittedAt: Date
});

export default mongoose.model("QuizAttempt", quizAttemptSchema);