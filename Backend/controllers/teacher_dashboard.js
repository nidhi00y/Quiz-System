import Quiz from "../models/Quiz.js";
import QuizAttempt from "../models/QuizAttempt.js";
import Student from "../models/Student.js";

export const getQuizResults = async (req, res) => {
    try {
        const { teacherId } = req.params;

        // Find the quiz created by this teacher
        const quiz = await Quiz.findOne({
            createdBy:teacherId
        });

        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        // Find attempts
        const attempts = await QuizAttempt.find({ quizId: quiz._id }).populate("studentId", "name rollNo department");

        const results = attempts.map(attempt => {
            // Ensure studentId exists before accessing
            if (attempt.studentId) {
                return {
                    roll: attempt.studentId.rollNo,
                    name: attempt.studentId.name,
                    marks: attempt.score
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
