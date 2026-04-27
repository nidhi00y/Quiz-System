import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";
import questionRoutes from "./routes/question_route.js";
import quizCreateRoutes from "./routes/quiz_create.js";
import quizStartRoutes from "./routes/quiz_start.js";
import quizSubmitRoutes from "./routes/quiz_submit.js";
import authRoutes from "./routes/auth.js";
import studentRoutes from "./routes/student.js";
import teacherRoutes from "./routes/teacher.js";
import AI from "./services/ai.js"


const app = express();
app.use(cors());

AI("maths")

connectDB();
app.use(express.json());

app.use("/addquestions", questionRoutes);
app.use("/createquiz", quizCreateRoutes);
app.use("/startquiz", quizStartRoutes);
app.use("/submitquiz", quizSubmitRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/teacher", teacherRoutes);


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
