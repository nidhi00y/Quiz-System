const express = require("express");
const router = express.Router();
const { getAvailableQuizzes, getStudentResults } = require("../controllers/student_dashboard");

router.get("/:studentId/quizzes", getAvailableQuizzes);
router.get("/:studentId/results", getStudentResults);

module.exports = router;
