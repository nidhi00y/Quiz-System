import ERPLayout from "../components/ERPLayout";
import { useNavigate } from "react-router-dom";

function StudentScheduledQuizzes() {
  const navigate = useNavigate();

  // Mock data (will come from backend later)
  const quizzes = [
    {
      id: "quiz1",
      subject: "Data Structures",
      quizNumber: 1,
      startTime: "2025-12-18T00:00",
      endTime: "2025-12-19T23:59",
    },
    {
      id: "quiz2",
      subject: "Operating Systems",
      quizNumber: 2,
      startTime: "2025-12-18T10:00",
      endTime: "2025-12-18T11:00",
    },
    {
      id: "quiz3",
      subject: "DBMS",
      quizNumber: 1,
      startTime: "2025-12-10T09:00",
      endTime: "2025-12-10T10:00",
    },
  ];

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
                  {quizzes.map((quiz) => {
                    const allowed = isAttemptAllowed(
                      quiz.startTime,
                      quiz.endTime
                    );
                    const upcoming = isUpcoming(quiz.startTime);

                    return (
                      <tr key={quiz.id}>
                        <td>{quiz.subject}</td>
                        <td>Quiz {quiz.quizNumber}</td>
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
                                navigate(`/student/attempt-quiz/${quiz.id}`)
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
