import mongoose from "mongoose";
import config from "./config.js";

const connectDB = async () => {
  try {
    await mongoose.connect(config.MONOG_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Error while connecting Database",error.message);
    process.exit(1);
  }
};

export default connectDB;
