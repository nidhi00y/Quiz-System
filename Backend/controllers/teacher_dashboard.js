const Quiz = require("../models/Quiz");
const QuizAttempt = require("../models/QuizAttempt");
const Student = require("../models/Student");

exports.getQuizResults = async (req, res) => {
    try {
        const { teacherId } = req.params;
        const { subject, quizNumber } = req.query;

        if (!subject || !quizNumber) {
            return res.status(400).json({ message: "Subject and Quiz Number are required" });
        }

        const title = `Quiz ${quizNumber}`;

        // Find the quiz created by this teacher
        const quiz = await Quiz.findOne({
            createdBy: teacherId,
            subject: subject,
            title: title
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
