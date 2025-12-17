const express = require("express");
const router = express.Router();
const { startQuiz } = require("../controllers/quiz_start");

router.post("/quizstart", startQuiz);

module.exports = router;
