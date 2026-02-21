import ERPLayout from "../components/ERPLayout";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../services/AuthContext";

function StudentScheduledQuizzes() {
  const navigate = useNavigate();

  const { user } = useAuth();
  const studentId = user?.id;

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await api.get(`/api/student/${studentId}/quizzes`);
        setQuizzes(res.data.quizzes);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching quizzes:", err);
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  const now = new Date();

  const isAttemptAllowed = (start, end) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    return now >= startTime && now <= endTime;
  };

  const isUpcoming = (start) => {
    return now < new Date(start);
  };

  return (
    <ERPLayout>
      <div className="row justify-content-center mt-4">
        <div className="col-md-11">

          {/* ===== ERP PANEL ===== */}
          <div className="erp-panel">
            <div className="erp-panel-header">
              Scheduled Quizzes
            </div>

            <div className="erp-panel-body">
              <table className="table table-bordered erp-table text-center align-middle">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Quiz</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6">Loading quizzes...</td>
                    </tr>
                  ) : quizzes.length === 0 ? (
                    <tr>
                      <td colSpan="6">No scheduled quizzes available.</td>
                    </tr>
                  ) : quizzes.map((quiz, index) => {
                    const allowed = isAttemptAllowed(
                      quiz.startTime,
                      quiz.endTime
                    );
                    const upcoming = isUpcoming(quiz.startTime);

                    return (
                      <tr key={quiz._id}>
                        <td>{quiz.subject}</td>
                        <td>{quiz.title || `Quiz ${index + 1}`}</td>
                        <td>
                          {new Date(quiz.startTime).toLocaleString()}
                        </td>
                        <td>
                          {new Date(quiz.endTime).toLocaleString()}
                        </td>
                        <td>
                          {allowed && (
                            <span style={{ color: "#3c763d", fontWeight: "600" }}>
                              Live
                            </span>
                          )}
                          {!allowed && upcoming && (
                            <span style={{ color: "#8a6d3b", fontWeight: "600" }}>
                              Upcoming
                            </span>
                          )}
                          {!allowed && !upcoming && (
                            <span style={{ color: "#777", fontWeight: "600" }}>
                              Closed
                            </span>
                          )}
                        </td>
                        <td>
                          {allowed ? (
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() =>
                                navigate(`/student/attempt-quiz/${quiz._id}`)
                              }
                            >
                              Attempt
                            </button>
                          ) : (
                            <button
                              className="btn btn-secondary btn-sm"
                              disabled
                            >
                              Not Available
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          {/* ===== ERP PANEL END ===== */}

        </div>
      </div>
    </ERPLayout>
  );
}

export default StudentScheduledQuizzes;
