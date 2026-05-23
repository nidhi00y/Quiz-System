import express from "express";

import SubjectTopics from "../models/SubjectTopics.js";

const router = express.Router();


// GET TOPICS OF SUBJECT
router.get("/:subject", async (req, res) => {

  try {

    const data =
      await SubjectTopics.findOne({
        subject: req.params.subject
      });

    if (!data) {

      return res.json([]);
    }

    res.json(data.topics);

  } catch (err) {

    res.status(500).json({
      message: err.message
    });
  }
});

export default router;