import express from "express";
import { createQuiz } from "../controllers/quiz_create.js";

const router = express.Router();

router.post("/", createQuiz);

export default router;
