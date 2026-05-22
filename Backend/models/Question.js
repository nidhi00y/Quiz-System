import mongoose from "mongoose";

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
    type: Number,
    required: true
  },

  subject: {
    type: String,
    required: true
  },

  // Teacher defined difficulty
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    required: true
  },

  // ML predicted difficulty
  mlDifficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "medium"
  },

  // Analytics for ML
  analytics: {
    attempts: {
      type: Number,
      default: 0
    },

    correct: {
      type: Number,
      default: 0
    },

    wrong: {
      type: Number,
      default: 0
    },

    skipped: {
      type: Number,
      default: 0
    },

    averageTime: {
      type: Number,
      default: 0
    }
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher"
  }
});

export default mongoose.model("Question", questionSchema);