import express from "express";
import { submitQuiz } from "../controllers/evaluation.js";

const router = express.Router();

router.post("/", submitQuiz);

export default router;
