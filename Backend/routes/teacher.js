import express from "express";
import { getQuizResults } from "../controllers/teacher_dashboard.js";

const router = express.Router();

router.get("/:teacherId/results", getQuizResults);

export default router;
