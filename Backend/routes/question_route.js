import express from "express";
import { addQuestion } from "../controllers/question_add.js";

const router = express.Router();

router.post("/", addQuestion);

export default router;
