import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";
// ----- STUDENT -----
export const studentSignup = async (req, res) => {
    try {
        const { rollNo, name, department, password } = req.body;

        // Check if exists
        let existingStudent = await Student.findOne({ rollNo });
        if (existingStudent) return res.status(400).json({ message: "Student with this Roll No already exists" });

        // Note: Use bcrypt for hashing in real production apps! Storing plain for now as per simple schema
        const student = await Student.create({ rollNo, name, department, password });

        res.status(201).json({ message: "Student registered successfully", user: { id: student._id, role: "student", name: student.name, rollNo: student.rollNo, department: student.department } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const studentLogin = async (req, res) => {
    try {
        const { rollNo, password } = req.body;

        const student = await Student.findOne({ rollNo });
        if (!student) return res.status(404).json({ message: "Student not found" });

        // Plaintext password check 
        if (student.password !== password) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        res.json({ message: "Login successful", user: { id: student._id, role: "student", name: student.name, rollNo: student.rollNo, department: student.department } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ----- TEACHER -----
export const teacherSignup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        let existingTeacher = await Teacher.findOne({ email });
        if (existingTeacher) return res.status(400).json({ message: "Teacher with this email already exists" });

        const teacher = await Teacher.create({ name, email, password });

        res.status(201).json({ message: "Teacher registered successfully", user: { id: teacher._id, role: "teacher", name: teacher.name, email: teacher.email } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const teacherLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const teacher = await Teacher.findOne({ email });
        if (!teacher) return res.status(404).json({ message: "Teacher not found" });

        if (teacher.password !== password) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        res.json({ message: "Login successful", user: { id: teacher._id, role: "teacher", name: teacher.name, email: teacher.email } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
