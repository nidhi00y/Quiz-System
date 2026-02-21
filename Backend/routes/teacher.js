const express = require("express");
const router = express.Router();
const { getQuizResults } = require("../controllers/teacher_dashboard");

router.get("/:teacherId/results", getQuizResults);

module.exports = router;
