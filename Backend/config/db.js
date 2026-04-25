const mongoose = require("mongoose");
import config from "./config";

const connectDB = async () => {
  try {
    await mongoose.connect(config.MONOG_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Error while connecting Database",error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
