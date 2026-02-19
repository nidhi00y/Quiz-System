import ERPLayout from "../components/ERPLayout";
import { useState } from "react";

function StudentResults() {
  const [subject, setSubject] = useState("");
  const [showResults, setShowResults] = useState(false);

  // Dummy results (API later)
  const results = [
    { quiz: "Quiz 1", marks: 18, status: "Attempted" },
    { quiz: "Quiz 2", marks: 22, status: "Attempted" },
    { quiz: "Quiz 3", marks: 15, status: "Attempted" },
  ];

  return (
    <ERPLayout>
      <div className="row justify-content-center mt-4">
        <div className="col-md-8">

          {/* ===== ERP PANEL ===== */}
          <div className="erp-panel">

            <div className="erp-panel-header">
              View Results
            </div>

            <div className="erp-panel-body">

              {/* FILTER SECTION */}
              <table className="table table-bordered erp-table" style={{ maxWidth: "400px" }}>
                <tbody>
                  <tr>
                    <td style={{ width: "35%", fontWeight: "bold" }}>
                      Subject
                    </td>
                    <td>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        style={{ width: "100%", padding: "4px" }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2" style={{ textAlign: "center" }}>
                      <button
                        className="btn btn-primary"
                        onClick={() => setShowResults(true)}
                        disabled={!subject}
                      >
                        View Results
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* RESULTS TABLE */}
              {showResults && (
                <table className="table table-bordered erp-table mt-4 text-center">
                  <thead>
                    <tr>
                      <th>Quiz</th>
                      <th>Marks</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r, index) => (
                      <tr key={index}>
                        <td>{r.quiz}</td>
                        <td>{r.marks}</td>
                        <td>{r.status}</td>
                      </tr>
                    ))}
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

export default StudentResults;
