import ERPLayout from "../components/ERPLayout";
import { useState } from "react";
import api from "../services/api";
import { useAuth } from "../services/AuthContext";

function ScheduleQuiz() {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    quizNumber: "",
    department: "",
    subject: "",
    semester: "",
    quizDate: "",
    startTime: "",
    duration: "",
    totalQuestions: "",
    marksPerQuestion: "",
    easy: "",
    medium: "",
    hard: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSchedule = async () => {
    try {
      const payload = {
        title: `Quiz ${form.quizNumber}`,
        department: form.department,
        subject: form.subject,
        startTime: `${form.quizDate}T${form.startTime}`,
        endTime: `${form.quizDate}T${new Date(new Date(`${form.quizDate}T${form.startTime}`).getTime() + form.duration * 60000).toTimeString().substring(0, 5)}`,
        easyCount: Number(form.easy),
        mediumCount: Number(form.medium),
        hardCount: Number(form.hard),
        createdBy: user?.id
      };
      await api.post("/createquiz", payload);
      alert("Quiz Scheduled Successfully");
      setStep(1); // reset or redirect
    } catch (e) {
      console.error(e);
      alert("Error scheduling quiz");
    }
  };

  return (
    <ERPLayout>
      <div className="row justify-content-center mt-4">
        <div className="col-md-9">

          {/* ===== ERP PANEL ===== */}
          <div className="erp-panel">

            <div className="erp-panel-header">
              Schedule Quiz (Step {step} of 3)
            </div>

            <div className="erp-panel-body">

              {/* STEP 1 */}
              {step === 1 && (
                <table className="table table-bordered erp-table">
                  <tbody>
                    <tr>
                      <td>Quiz Number</td>
                      <td><input name="quizNumber" onChange={handleChange} /></td>
                    </tr>
                    <tr>
                      <td>Department</td>
                      <td>
                        <select name="department" value={form.department} onChange={handleChange} required style={{ width: "100%", padding: "4px" }}>
                          <option value="">Select Department</option>
                          <option value="CSE">CSE</option>
                          <option value="IT">IT</option>
                          <option value="ECE">ECE</option>
                          <option value="ME">ME</option>
                          <option value="TT">TT</option>
                        </select>
                      </td>
                    </tr>
                    <tr>
                      <td>Subject</td>
                      <td>
                        <select name="subject" value={form.subject} onChange={handleChange} required style={{ width: "100%", padding: "4px" }}>
                          <option value="">Select Subject</option>
                          <option value="DSA">DSA</option>
                          <option value="OS">OS</option>
                          <option value="DBMS">DBMS</option>
                          <option value="CN">CN</option>
                          <option value="API Testing">API Testing</option>
                        </select>
                      </td>
                    </tr>
                    <tr>
                      <td>Semester</td>
                      <td><input name="semester" onChange={handleChange} /></td>
                    </tr>
                    <tr>
                      <td>Quiz Date</td>
                      <td><input type="date" name="quizDate" onChange={handleChange} /></td>
                    </tr>
                    <tr>
                      <td>Start Time</td>
                      <td><input type="time" name="startTime" onChange={handleChange} /></td>
                    </tr>
                    <tr>
                      <td>Duration (minutes)</td>
                      <td><input type="number" name="duration" onChange={handleChange} /></td>
                    </tr>
                    <tr>
                      <td colSpan="2" style={{ textAlign: "center" }}>
                        <button className="btn btn-primary" onClick={() => setStep(2)}>
                          Next
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <table className="table table-bordered erp-table">
                  <tbody>
                    <tr>
                      <td>Total Questions</td>
                      <td><input type="number" name="totalQuestions" onChange={handleChange} /></td>
                    </tr>
                    <tr>
                      <td>Marks per Question</td>
                      <td><input type="number" name="marksPerQuestion" onChange={handleChange} /></td>
                    </tr>
                    <tr>
                      <td colSpan="2" style={{ textAlign: "center" }}>
                        <button className="btn btn-primary" onClick={() => setStep(3)}>
                          Next
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <table className="table table-bordered erp-table">
                  <tbody>
                    <tr>
                      <td>Easy Questions</td>
                      <td><input type="number" name="easy" onChange={handleChange} /></td>
                    </tr>
                    <tr>
                      <td>Medium Questions</td>
                      <td><input type="number" name="medium" onChange={handleChange} /></td>
                    </tr>
                    <tr>
                      <td>Hard Questions</td>
                      <td><input type="number" name="hard" onChange={handleChange} /></td>
                    </tr>
                    <tr>
                      <td colSpan="2" style={{ textAlign: "center" }}>
                        <button className="btn btn-success" onClick={handleSchedule}>
                          Schedule Quiz
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}

            </div>
          </div>
          {/* ===== ERP PANEL END ===== */}

        </div>
      </div>
    </ERPLayout>
  );
}

export default ScheduleQuiz;
