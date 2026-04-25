import express from "express";
import { startQuiz } from "../controllers/quiz_start.js";

const router = express.Router();

router.post("/", startQuiz);

export default router;
