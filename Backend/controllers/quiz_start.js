import mongoose from "mongoose";

import Quiz from "../models/Quiz.js";
import Question from "../models/Question.js";
import QuizAttempt from "../models/QuizAttempt.js";
import Student from "../models/Student.js";


export const startQuiz = async (req, res) => {

  try {

    const { quizId, studentId } = req.body;


    // ===== VALIDATE IDS =====
    if (!mongoose.Types.ObjectId.isValid(quizId)) {

      return res.status(400).json({
        message: "Invalid quizId"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(studentId)) {

      return res.status(400).json({
        message: "Invalid studentId"
      });
    }


    // ===== FETCH QUIZ =====
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {

      return res.status(404).json({
        message: "Quiz not found"
      });
    }


    // ===== CHECK STUDENT DEPARTMENT =====
    const x =
      await Student.findById(studentId);

    const d =
      x
        ? x.department
        : "Computer Science";

    if (d !== quiz.department) {

      return res.status(404).json({

        message:
          "You are not allowed to give this quiz"
      });
    }


    // ===== CHECK QUIZ TIME =====
    const now = new Date();

    if (
      now < quiz.startTime ||
      now > quiz.endTime
    ) {

      return res.status(403).json({

        message:
          "Quiz not available at this time"
      });
    }


    // ===== CHECK ATTEMPT =====
    const alreadyAttempted =
      await QuizAttempt.findOne({
        quizId,
        studentId
      });

    if (alreadyAttempted) {

      return res.status(400).json({
        message: "Quiz already attempted"
      });
    }


    // ===== EASY QUESTIONS =====
    const easyQuestions =
      await Question.aggregate([

        {
          $match: {

            mlDifficulty: "easy",

            subject: quiz.subject,

            // ===== TOPIC FILTER =====
            topic: {
              $in: quiz.topics || []
            }
          }
        },

        {
          $sample: {
            size: quiz.easyCount
          }
        }
      ]);


    // ===== MEDIUM QUESTIONS =====
    const mediumQuestions =
      await Question.aggregate([

        {
          $match: {

            mlDifficulty: "medium",

            subject: quiz.subject,

            // ===== TOPIC FILTER =====
            topic: {
              $in: quiz.topics || []
            }
          }
        },

        {
          $sample: {
            size: quiz.mediumCount
          }
        }
      ]);


    // ===== HARD QUESTIONS =====
    const hardQuestions =
      await Question.aggregate([

        {
          $match: {

            mlDifficulty: "hard",

            subject: quiz.subject,

            // ===== TOPIC FILTER =====
            topic: {
              $in: quiz.topics || []
            }
          }
        },

        {
          $sample: {
            size: quiz.hardCount
          }
        }
      ]);


    // ===== MERGE QUESTIONS =====
    const questions = [

      ...easyQuestions,

      ...mediumQuestions,

      ...hardQuestions
    ];


    // ===== VALIDATE QUESTIONS =====
    if (questions.length === 0) {

      return res.status(400).json({

        message:
          "No questions available for selected topics"
      });
    }


    // ===== QUIZ TIMING =====
    const totalQuestions =
      questions.length;

    const quizDurationMinutes =
      Number(

        quiz.durationMinutes ||

        (
          quiz.startTime &&
          quiz.endTime

            ? (
                new Date(
                  quiz.endTime
                ).getTime()

                -

                new Date(
                  quiz.startTime
                ).getTime()

              ) / 60000

            : 0
        )
      );


    const totalDurationSeconds =
      Math.max(

        1,

        Math.round(
          quizDurationMinutes * 60
        )
      );


    const perQuestionTimeSeconds =
      Math.max(

        1,

        Math.floor(
          totalDurationSeconds /
          totalQuestions
        )
      );


    // ===== CREATE ATTEMPT =====
    await QuizAttempt.create({

      quizId,

      studentId,

      answers: [],

      score: 0,

      submittedAt: null
    });


    // ===== SAFE QUESTION FORMAT =====
    const safeQuestions =
      questions.map((q) => ({

        _id: q._id,

        questionText:
          q.questionText,

        options:
          q.options,

        difficulty:
          q.difficulty,

        mlDifficulty:
          q.mlDifficulty,

        subject:
          q.subject,

        // ===== INCLUDE TOPIC =====
        topic:
          q.topic
      }));


    // ===== RESPONSE =====
    res.json({

      message:
        "Quiz started successfully",

      subject:
        quiz.subject,

      topics:
        quiz.topics,

      totalQuestions,

      quizDurationMinutes,

      totalDurationSeconds,

      perQuestionTimeSeconds,

      questions:
        safeQuestions
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });
  }
};