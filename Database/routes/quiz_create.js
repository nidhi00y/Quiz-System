const express = require("express");
const router = express.Router();

const { createQuiz } = require("../controllers/quiz_create");

router.post("/", createQuiz);

module.exports = router;
