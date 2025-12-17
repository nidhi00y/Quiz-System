const express = require("express");
const router = express.Router();

const { createQuiz } = require("../controllers/quiz_create.js");

router.post("/createQuiz", createQuiz);

module.exports = router;
