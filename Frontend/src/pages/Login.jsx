import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ERPLayout from "../components/ERPLayout";
import { useAuth } from "../services/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { setRole } = useAuth();
  const [role, setLocalRole] = useState("");

  const handleLogin = () => {
    if (!role) {
      alert("Please select role");
      return;
    }

    setRole(role);

    if (role === "teacher") navigate("/teacher");
    if (role === "student") navigate("/student");
  };

  return (
    <ERPLayout hideNavbarActions>
      {/* ERP-style background */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "60px",
        }}
      >
        <div
          style={{
            width: "380px",
            background: "#ffffff",
            border: "1px solid #cfd6dd",
          }}
        >
          {/* ERP header strip */}
          <div
            style={{
              background: "#337ab7",
              color: "#ffffff",
              padding: "8px",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            QUIZ PORTAL Login
          </div>

          {/* Body */}
          <div style={{ padding: "20px" }}>
            <div style={{ marginBottom: "15px" }}>
              <label>Login As</label>
              <select
                value={role}
                onChange={(e) => setLocalRole(e.target.value)}
                style={{
                  width: "100%",
                  padding: "6px",
                  marginTop: "5px",
                  border: "1px solid #cfd6dd",
                  background: "#f8f9fa",
                }}
              >
                <option value="">Select Role</option>
                <option value="teacher">Teacher</option>
                <option value="student">Student</option>
              </select>
            </div>

            <button
              onClick={handleLogin}
              style={{
                width: "100%",
                padding: "7px",
                background: "#337ab7",
                color: "#ffffff",
                border: "none",
                fontWeight: "bold",
              }}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </ERPLayout>
  );
}

export default Login;
