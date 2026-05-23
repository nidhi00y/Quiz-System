import mongoose from "mongoose";

const subjectTopicsSchema = new mongoose.Schema({

  subject: {
    type: String,
    required: true,
    unique: true
  },

  topics: {
    type: [String],
    required: true
  }

});

export default mongoose.model(
  "SubjectTopics",
  subjectTopicsSchema
);