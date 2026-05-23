import Question from "../models/Question.js";


export const getFlaggedQuestions =
  async (req, res) => {

    try {

      const flaggedQuestions =

        await Question.find({

          flaggedForReview: true,

          invalidated: {
            $ne: true
          }

        }).lean();


      res.json(
        flaggedQuestions
      );

    } catch (err) {

      console.error(err);

      res.status(500).json({

        message:
          err.message
      });
    }
};