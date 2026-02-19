import ERPLayout from "../components/ERPLayout";
import { useState } from "react";

function ScheduleQuiz() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    quizNumber: "",
    subject: "",
    semester: "",
    quizDate: "",
    startTime: "",
    duration: "",
    totalQuestions: "",
    marksPerQuestion: "",
    easy: "",
    medium: "",
    hard: "",
    topics: []
  });

  const topicsList = ["Arrays", "Stacks", "Queues", "Trees", "Graphs"];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTopicChange = (topic) => {
    setForm((prev) => ({
      ...prev,
      topics: prev.topics.includes(topic)
        ? prev.topics.filter(t => t !== topic)
        : [...prev.topics, topic]
    }));
  };

  return (
    <ERPLayout>
      <div className="row justify-content-center mt-4">
        <div className="col-md-9">

          {/* ===== ERP PANEL ===== */}
          <div className="erp-panel">

            <div className="erp-panel-header">
              Schedule Quiz (Step {step} of 4)
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
                      <td>Subject</td>
                      <td><input name="subject" onChange={handleChange} /></td>
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
                        <button className="btn btn-primary" onClick={() => setStep(4)}>
                          Next
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}

              {/* STEP 4 */}
              {step === 4 && (
                <>
                  <table className="table table-bordered erp-table">
                    <tbody>
                      {topicsList.map(topic => (
                        <tr key={topic}>
                          <td>
                            <input
                              type="checkbox"
                              onChange={() => handleTopicChange(topic)}
                              style={{ marginRight: "8px" }}
                            />
                            {topic}
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td style={{ textAlign: "center" }}>
                          <button className="btn btn-success">
                            Schedule Quiz
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </>
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
