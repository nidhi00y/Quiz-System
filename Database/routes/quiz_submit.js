const express = require("express");
const router = express.Router();
const { submitQuiz } = require("../controllers/Evaluation");

router.post("/submit", submitQuiz);

module.exports = router;
