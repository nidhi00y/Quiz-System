import express from "express";
import { addQuestion , addQuestionbyAI } from "../controllers/question_add.js";

const router = express.Router();

router.post("/", addQuestion);
router.post("/byai",addQuestionbyAI)

export default router;
