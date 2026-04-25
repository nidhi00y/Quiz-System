import express from "express";
import { getAvailableQuizzes, getStudentResults } from "../controllers/student_dashboard.js";

const router = express.Router();

router.get("/:studentId/quizzes", getAvailableQuizzes);
router.get("/:studentId/results", getStudentResults);

export default router;
