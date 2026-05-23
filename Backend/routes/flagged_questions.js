import express from "express";

import {
  getFlaggedQuestions
}
from "../controllers/flagged_questions.js";

const router = express.Router();

router.get("/", getFlaggedQuestions);

export default router;