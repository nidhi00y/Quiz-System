const mongoose = require("mongoose");
const Student = require("./models/Student");
const Teacher = require("./models/Teacher");
const Question = require("./models/Question");
const Quiz = require("./models/Quiz");

async function testSchema() {
  await mongoose.connect("mongodb://127.0.0.1:27017/quizDB");

  // Insert student
  const student = await Student.create({
    rollNo: "CS101",
    name: "Nidhi",
    password: "hashed_password"
  });

  console.log("Student saved:", student);

  // Insert teacher
  const teacher = await Teacher.create({
    name: "Dr Sharma",
    email: "sharma@gmail.com",
    password: "hashed_password"
  });

  console.log("Teacher saved:", teacher);

  // Insert question
  const question = await Question.create({
    questionText: "What is OS?",
    options: ["Hardware", "Software", "Both", "None"],
    correctOption: 2,
    difficulty: "easy",
    createdBy: teacher._id
  });

  console.log("Question saved:", question);

  // Insert quiz
  const quiz = await Quiz.create({
    title: "OS Quiz",
    startTime: new Date(),
    endTime: new Date(Date.now() + 30 * 60000),
    easyCount: 2,
    mediumCount: 1,
    hardCount: 1,
    createdBy: teacher._id
  });

  console.log("Quiz saved:", quiz);

  mongoose.disconnect();
}

testSchema();
