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

import aiRoutes from "./routes/ai.js";

import reviewQuestionRoutes
from "./routes/review_question.js";
import flaggedQuestionRoutes
from "./routes/flagged_questions.js";

// ===== NEW TOPIC ROUTES =====
import topicRoutes from "./routes/topic_routes.js";


const app = express();

app.use(cors());

connectDB();

app.use(express.json());


// ===== EXISTING ROUTES =====
app.use("/addquestions", questionRoutes);

app.use("/createquiz", quizCreateRoutes);

app.use("/startquiz", quizStartRoutes);

app.use("/submitquiz", quizSubmitRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/student", studentRoutes);

app.use("/api/teacher", teacherRoutes);

app.use("/api", aiRoutes);


// ===== NEW TOPIC ROUTE =====
app.use("/topics", topicRoutes);

app.use(
  "/review-question",
  reviewQuestionRoutes
);

app.use(
  "/flagged-questions",
  flaggedQuestionRoutes
);


const PORT = 5000;

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );
});