const express = require("express");
const router = express.Router();
const { addQuestion } = require("../controllers/question_add");

router.post("/addQuestion", addQuestion);

module.exports = router;
