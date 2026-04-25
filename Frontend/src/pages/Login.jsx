import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ERPLayout from "../components/ERPLayout";
import { useAuth } from "../services/AuthContext";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [isSignup, setIsSignup] = useState(false);
  const [role, setLocalRole] = useState("");

  // Form fields
  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!role) {
      setErrorMsg("Please select a role");
      return;
    }

    try {
      const endpoint = `/api/auth/${role}/${isSignup ? 'signup' : 'login'}`;
      let payload = {};

      if (isSignup) {
        if (role === 'student') payload = { name, rollNo, department, semester, password };
        if (role === 'teacher') payload = { name, email, password };
      } else {
        if (role === 'student') payload = { rollNo, password };
        if (role === 'teacher') payload = { email, password };
      }

      const res = await api.post(endpoint, payload);
      login(res.data.user); // Persist User Data + Role

      if (role === "teacher") navigate("/teacher");
      if (role === "student") navigate("/student");

    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || `Error attempting to ${isSignup ? "Sign Up" : "Log In"}`);
    }
  };

  return (
    <ERPLayout hideNavbarActions>
      <div style={{ display: "flex", justifyContent: "center", marginTop: "60px" }}>
        <div style={{ width: "380px", background: "#ffffff", border: "1px solid #cfd6dd" }}>
          <div style={{ background: "#337ab7", color: "#ffffff", padding: "8px", fontWeight: "bold", textAlign: "center" }}>
            QUIZ PORTAL {isSignup ? "Signup" : "Login"}
          </div>

          <div style={{ padding: "20px" }}>
            {errorMsg && <p style={{ color: "red", textAlign: "center" }}>{errorMsg}</p>}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "15px" }}>
                <label>I am a</label>
                <select
                  value={role}
                  onChange={(e) => setLocalRole(e.target.value)}
                  style={{ width: "100%", padding: "6px", marginTop: "5px" }}
                  required
                >
                  <option value="">Select Role</option>
                  <option value="teacher">Teacher</option>
                  <option value="student">Student</option>
                </select>
              </div>

              {isSignup && (
                <div style={{ marginBottom: "15px" }}>
                  <label>Full Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} required style={{ width: "100%", padding: "6px" }} />
                </div>
              )}

              {role === "student" && (
                <div style={{ marginBottom: "15px" }}>
                  <label>Roll Number</label>
                  <input type="text" value={rollNo} onChange={e => setRollNo(e.target.value)} required style={{ width: "100%", padding: "6px" }} />
                </div>
              )}

              {role === "student" && isSignup && (
                <div style={{ marginBottom: "15px" }}>
                  <label>Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                    style={{ width: "100%", padding: "6px" }}
                  >
                    <option value="">Select Department</option>
                    <option value="CSE">CSE</option>
                    <option value="IT">IT</option>
                    <option value="ECE">ECE</option>
                    <option value="ME">ME</option>
                    <option value="TT">TT</option>
                  </select>
                </div>
              )}

              {role === "student" && isSignup && (
                <div style={{ marginBottom: "15px" }}>
                  <label>Semester</label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    required
                    style={{ width: "100%", padding: "6px" }}
                  >
                    <option value="">Select Semester</option>
                    <option value="1">1st Semester</option>
                    <option value="2">2nd Semester</option>
                    <option value="3">3rd Semester</option>
                    <option value="4">4th Semester</option>
                    <option value="5">5th Semester</option>
                    <option value="6">6th Semester</option>
                    <option value="7">7th Semester</option>
                    <option value="8">8th Semester</option>
                  </select>
                </div>
              )}

              {role === "teacher" && (
                <div style={{ marginBottom: "15px" }}>
                  <label>Email ID</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: "100%", padding: "6px" }} />
                </div>
              )}

              <div style={{ marginBottom: "15px" }}>
                <label>Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: "100%", padding: "6px" }} />
              </div>

              <button
                type="submit"
                style={{ width: "100%", padding: "7px", background: "#337ab7", color: "#ffffff", border: "none", fontWeight: "bold" }}
              >
                {isSignup ? "Sign Up" : "Log In"}
              </button>
            </form>

            <div style={{ textAlign: "center", marginTop: "15px" }}>
              <span
                style={{ color: "#337ab7", cursor: "pointer", textDecoration: "underline" }}
                onClick={() => { setIsSignup(!isSignup); setErrorMsg(""); }}
              >
                {isSignup ? "Already have an account? Log In" : "Don't have an account? Sign Up"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </ERPLayout>
  );
}

export default Login;
