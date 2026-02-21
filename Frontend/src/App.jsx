import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import "./styles/form-theme.css";
import axios from "axios";



import Login from "./pages/Login";

/* ================= TEACHER PAGES ================= */
import TeacherDashboard from "./pages/TeacherDashboard";
import UploadQuestionBank from "./pages/UploadQuestionBank";
import ScheduleQuiz from "./pages/ScheduleQuiz";
import ViewResults from "./pages/ViewResults";

/* ================= STUDENT PAGES ================= */
import StudentDashboard from "./pages/StudentDashboard";
import StudentScheduledQuizzes from "./pages/StudentScheduledQuizzes";
import AttemptQuiz from "./pages/AttemptQuiz";
import StudentResults from "./pages/StudentResults";


/* ================= AUTH ================= */
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
   useEffect(() => {
    axios.get("http://localhost:5000/")
      .then(res => console.log(res.data))
      .catch(err => console.log(err));
  }, []);
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= PUBLIC ================= */}
        <Route path="/" element={<Login />} />

        {/* ================= TEACHER ================= */}
        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowedRole="teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/upload-questions"
          element={
            <ProtectedRoute allowedRole="teacher">
              <UploadQuestionBank />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/schedule-quiz"
          element={
            <ProtectedRoute allowedRole="teacher">
              <ScheduleQuiz />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher/view-results"
          element={
            <ProtectedRoute allowedRole="teacher">
              <ViewResults />
            </ProtectedRoute>
          }
        />

        {/* ================= STUDENT ================= */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/quizzes"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentScheduledQuizzes />
            </ProtectedRoute>
          }
        />

        <Route
  path="/student/attempt-quiz/:quizId"
  element={
    <ProtectedRoute allowedRole="student">
      <AttemptQuiz />
    </ProtectedRoute>
  }
/>

        <Route
  path="/student/results"
  element={
    <ProtectedRoute allowedRole="student">
      <StudentResults />
    </ProtectedRoute>
  }
/>


      </Routes>
    </BrowserRouter>
  );
}

export default App;
