const mongoose = require("mongoose");
const Student = require("./models/Student");
const Teacher = require("./models/Teacher");
const Question = require("./models/Question");
const Quiz = require("./models/Quiz");

async function testSchema() {
  await mongoose.connect("mongodb://127.0.0.1:27017/quizDB");

  // Insert student
  const student = await Student.create({
    rollNo: "CS102",
    name: "Saumya",
    password: "hashed_password"
  });

  console.log("Student saved:", student);

  // Insert teacher
  const teacher = await Teacher.create({
    name: "Dr x",
    email: "x@gmail.com",
    password: "hashed_password"
  });

  console.log("Teacher saved:", teacher);

  mongoose.disconnect();
}

testSchema();
