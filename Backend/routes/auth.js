import express from "express";
import { studentSignup, studentLogin, teacherSignup, teacherLogin } from "../controllers/auth.js";

const router = express.Router();

router.post("/student/signup", studentSignup);
router.post("/student/login", studentLogin);
router.post("/teacher/signup", teacherSignup);
router.post("/teacher/login", teacherLogin);

export default router;
