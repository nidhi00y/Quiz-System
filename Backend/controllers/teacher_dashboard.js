import Quiz from "../models/Quiz.js";
import QuizAttempt from "../models/QuizAttempt.js";
import Student from "../models/Student.js";

export const getQuizResults = async (req, res) => {
    try {
        const { teacherId } = req.params;

        const { subject, quizNumber, semester } = req.query;

        // Note: For a real app, you'd match the specific quiz based on subject/quizNumber
        // Since schema only has title/subject, we'll assume the quiz query matches the exact one needed
        const quizQuery = { createdBy: teacherId };
        if (subject) quizQuery.subject = subject;
        if (quizNumber) quizQuery.title = new RegExp(`.*${quizNumber}.*`, "i");

        const quiz = await Quiz.findOne(quizQuery);

        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        // Find attempts
        const attempts =
  await QuizAttempt.find({

    quizId: quiz._id,

    submittedAt: {
      $ne: null
    }

  }).populate(

    "studentId",

    "name rollNo department semester"
  );

        const results = attempts.map(attempt => {
            // Ensure studentId exists before accessing
            if (attempt.studentId) {
                // If a semester filter was provided, enforce it
                if (semester && attempt.studentId.semester !== semester) {
                    return null;
                }
                return {
                    roll: attempt.studentId.rollNo,
                    name: attempt.studentId.name,
                    marks: attempt.score,
                    semester: attempt.studentId.semester
                };
            }
            return null;
        }).filter(r => r !== null);

        res.json({
            message: "Results fetched successfully",
            results
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};
