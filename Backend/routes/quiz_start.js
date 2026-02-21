const express = require("express");
const router = express.Router();

const { startQuiz } = require("../controllers/quiz_start");

router.post("/", startQuiz);

module.exports = router;
