import mongoose from "mongoose";
import Quiz from "../models/Quiz.js";
import QuizAttempt from "../models/QuizAttempt.js";
import Student from "../models/Student.js";

export const getAvailableQuizzes = async (req, res) => {
    try {
        const { studentId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(studentId)) {
            // Ignore invalid or return empty
            return res.status(400).json({ message: "Invalid studentId" });
        }

        const student = await Student.findById(studentId);
        let department = "Computer Science"; // Fallback for testing
        if (student) {
            department = student.department;
        }

        // Fetch quizzes matching student's department
        const quizzes = await Quiz.find({ department: department });

        res.json({
            message: "Quizzes fetched successfully",
            quizzes
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getStudentResults = async (req, res) => {
    try {
        const { studentId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({ message: "Invalid studentId" });
        }

        // Find attempts populated with quiz details
        const attempts = await QuizAttempt.find({ studentId }).populate("quizId", "title subject");

        res.json({
            message: "Results fetched successfully",
            attempts
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
