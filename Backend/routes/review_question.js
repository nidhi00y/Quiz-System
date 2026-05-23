import express from "express";

import {
  reviewQuestion
}
from "../controllers/review_question.js";

const router = express.Router();

router.post("/", reviewQuestion);

export default router;