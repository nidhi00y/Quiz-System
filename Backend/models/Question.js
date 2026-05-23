import mongoose from "mongoose";

const questionSchema =
  new mongoose.Schema({

    questionText: {
      type: String,
      required: true
    },

    options: {
      type: [String],

      validate:
        (v) => v.length === 4
    },

    correctOption: {
      type: Number,
      required: true
    },

    previousCorrectOption: {
      type: Number,
      default: null
    },

    subject: {
      type: String,
      required: true
    },

    // ===== TOPIC =====
    topic: {
      type: String,
      default: "General"
    },

    difficulty: {
      type: String,

      enum: [
        "easy",
        "medium",
        "hard"
      ],

      required: true
    },

    createdBy: {
      type:
        mongoose.Schema.Types.ObjectId,

      ref: "Teacher"
    },


    // ===== ML DIFFICULTY =====
    mlDifficulty: {
      type: String,

      enum: [
        "easy",
        "medium",
        "hard"
      ],

      default: function () {
        return this.difficulty;
      }
    },


    // ===== ANALYTICS =====
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


    // ===== MODERATION =====

    flaggedForReview: {
      type: Boolean,
      default: false
    },

    flagReason: {
      type: String,
      default: ""
    },

    invalidated: {
      type: Boolean,
      default: false
    },


    // ===== HUMAN REVIEW OVERRIDE =====
    manuallyReviewed: {
      type: Boolean,
      default: false
    }

  });

export default mongoose.model(
  "Question",
  questionSchema
);