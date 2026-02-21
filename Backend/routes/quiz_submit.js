const express = require("express");
const router = express.Router();
const { submitQuiz } = require("../controllers/evaluation");

router.post("/", submitQuiz);

module.exports = router;
