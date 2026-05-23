import QuizAttempt from "../models/QuizAttempt.js";

import Question from "../models/Question.js";

import { exec } from "child_process";


export const submitQuiz = async (
  req,
  res
) => {

  try {

    const {
      quizId,
      answers,
      studentId
    } = req.body;


    // ===== FIND ATTEMPT =====
    const existingAttempt =
      await QuizAttempt.findOne({

        quizId,
        studentId
      });

    if (!existingAttempt) {

      return res.status(400).json({

        message:
          "Quiz attempt not found. Please start the quiz first."
      });
    }

    if (existingAttempt.submittedAt) {

      return res.status(400).json({
        message: "Quiz already submitted"
      });
    }


    let score = 0;


    // ===== PROCESS EACH ANSWER =====
    for (let ans of answers) {

      const question =
        await Question.findById(
          ans.questionId
        );

      if (!question) continue;


      // ===== UPDATE ATTEMPTS =====
      question.analytics.attempts += 1;


      // ===== SKIPPED =====
      if (
        ans.skipped ||
        ans.selectedOption === -1
      ) {

        question.analytics.skipped += 1;
      }

      // ===== CORRECT =====
      else if (
        question.correctOption ===
        ans.selectedOption
      ) {

        score++;

        question.analytics.correct += 1;
      }

      // ===== WRONG =====
      else {

        question.analytics.wrong += 1;
      }


      // ===== UPDATE AVERAGE TIME =====
      question.analytics.averageTime =

        (
          (
            question.analytics.averageTime *

            (
              question.analytics.attempts - 1
            )
          )

          + (ans.timeTaken || 0)

        )

        /

        question.analytics.attempts;


      // =================================================
      // ===== ML + MODERATION ACTIVATION THRESHOLD ======
      // =================================================

      if (
        question.analytics.attempts >= 20
      ) {

        const accuracy =

          question.analytics.correct /

          question.analytics.attempts;


        const skipRate =

          question.analytics.skipped /

          question.analytics.attempts;


        const avgTime =

          question.analytics.averageTime;


        // ==========================================
        // ===== ML DIFFICULTY PREDICTION ===========
        // ==========================================

        const command =

          `python ml/predict.py ` +

          `${accuracy} ` +

          `${avgTime} ` +

          `${skipRate}`;


        const predictedDifficulty =

          await new Promise(

            (resolve, reject) => {

              exec(

                command,

                {
                  cwd: process.cwd()
                },

                (
                  error,
                  stdout,
                 stderr
                ) => {

                  if (error) {

                    console.error(stderr);

                    reject(error);

                  } else {

                    resolve(
                      stdout.trim()
                    );
                  }
                }
              );
            }
          );


        // ===== UPDATE ML DIFFICULTY =====
        question.mlDifficulty =
          predictedDifficulty;


        // ==========================================
        // ===== AUTOMATIC FLAGGING SYSTEM ==========
        // ==========================================

        let reasons = [];


        // ===== HIGH SKIP RATE =====
        if (skipRate > 0.6) {

          reasons.push(
            "High Skip Rate"
          );
        }


        // ===== VERY LOW ACCURACY =====
        if (accuracy < 0.2) {

          reasons.push(
            "Very Low Accuracy"
          );
        }


        // ===== EXCESSIVE TIME =====
        if (avgTime > 40) {

          reasons.push(
            "Excessive Average Time"
          );
        }


        // ==================================================
        // ===== ONLY FLAG IF NOT MANUALLY REVIEWED =========
        // ==================================================

        if (!question.manuallyReviewed) {

          if (reasons.length > 0) {

            question.flaggedForReview =
              true;

            question.flagReason =
              reasons.join(", ");

          } else {

            question.flaggedForReview =
              false;

            question.flagReason = "";
          }
        }

      } else {

        // =====================================
        // ===== BEFORE 20 ATTEMPTS ============
        // =====================================

        question.mlDifficulty =
          question.difficulty;
      }


      // ===== SAVE QUESTION =====
      await question.save();
    }


    // ===== SAVE ATTEMPT =====
    existingAttempt.answers =
      answers;

    existingAttempt.score =
      score;

    existingAttempt.submittedAt =
      new Date();

    await existingAttempt.save();


    // ===== RESPONSE =====
    res.json({

      message:
        "Quiz submitted successfully",

      score,

      total: answers.length
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      message:
        error.message
    });
  }
};