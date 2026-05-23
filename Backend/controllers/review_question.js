import Question from "../models/Question.js";

import QuizAttempt from "../models/QuizAttempt.js";


// =====================================
// ===== REVIEW QUESTION ===============
// =====================================
export const reviewQuestion =
  async (req, res) => {

    try {

      const {
        questionId,
        action,
        newCorrectOption
      } = req.body;


      const question =
        await Question.findById(
          questionId
        );

      if (!question) {

        return res.status(404).json({

          message:
            "Question not found"
        });
      }


      // ====================================
      // ===== INVALIDATE QUESTION ==========
      // ====================================
      if (action === "invalidate") {

        // ===== SAFETY CHECK =====
        if (question.invalidated) {

          return res.status(400).json({

            message:
              "Question already invalidated"
          });
        }


        // ===== UPDATE QUESTION =====
        await Question.updateOne(

          { _id: question._id },

          {

            $set: {

              invalidated: true,

              flaggedForReview: false,

              flagReason: "",

              manuallyReviewed: true
            }
          }
        );


        // ===== FIND ATTEMPTS =====
        const attempts =
          await QuizAttempt.find({

            "answers.questionId":
              question._id
          });


        // ===== GIVE +1 =====
        for (const attempt of attempts) {

          attempt.score += 1;

          await attempt.save();
        }


        return res.json({

          message:
            "Question invalidated and scores updated"
        });
      }


      // ====================================
      // ===== CHANGE CORRECT OPTION ========
      // ====================================
      if (
        action ===
        "changeCorrectOption"
      ) {

        if (
          newCorrectOption === undefined
        ) {

          return res.status(400).json({

            message:
              "newCorrectOption required"
          });
        }


        // ===== STORE OLD OPTION =====
        const oldCorrectOption =
          question.correctOption;


        // ===== UPDATE QUESTION =====
        await Question.updateOne(

          { _id: question._id },

          {

            $set: {

              correctOption:
                newCorrectOption,

              flaggedForReview:
                false,

              flagReason:
                "",

              invalidated:
                false,

              manuallyReviewed:
                true
            },

            $unset: {

              previousCorrectOption:
                ""
            }
          }
        );


        // ===== FIND ATTEMPTS =====
        const attempts =
          await QuizAttempt.find({

            "answers.questionId":
              question._id
          });


        // ===== RECALCULATE SCORES =====
        for (const attempt of attempts) {

          const answer =
            attempt.answers.find(

              (a) =>

                a.questionId.toString()

                ===

                question._id.toString()
            );

          if (!answer) continue;


          const selected =
            answer.selectedOption;


          const wasCorrect =
            selected === oldCorrectOption;

          const isCorrect =
            selected === newCorrectOption;


          // WRONG -> CORRECT
          if (
            !wasCorrect &&
            isCorrect
          ) {

            attempt.score += 1;
          }


          // CORRECT -> WRONG
          else if (
            wasCorrect &&
            !isCorrect
          ) {

            attempt.score -= 1;
          }


          await attempt.save();
        }


        return res.json({

          message:
            "Correct option updated and scores revised"
        });
      }


      return res.status(400).json({

        message:
          "Invalid action"
      });

    } catch (err) {

      console.error(err);

      res.status(500).json({

        error: err.message
      });
    }
};