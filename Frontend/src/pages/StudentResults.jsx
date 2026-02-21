import ERPLayout from "../components/ERPLayout";
import { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../services/AuthContext";

function StudentResults() {
  const [subject, setSubject] = useState("");
  const [showResults, setShowResults] = useState(false);

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const studentId = user?.id;

  const fetchResults = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/student/${studentId}/results`);
      // Optional: Filter by subject if user typed one
      let fetched = res.data.attempts;
      if (subject) {
        fetched = fetched.filter(r =>
          r.quizId?.subject?.toLowerCase().includes(subject.toLowerCase()) ||
          r.quizId?.title?.toLowerCase().includes(subject.toLowerCase())
        );
      }
      setResults(fetched);
    } catch (err) {
      console.error(err);
      alert("Error fetching results");
    } finally {
      setLoading(false);
      setShowResults(true);
    }
  };

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
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        style={{ width: "100%", padding: "4px" }}
                      >
                        <option value="">All Subjects</option>
                        <option value="Data Structures">Data Structures</option>
                        <option value="Operating Systems">Operating Systems</option>
                        <option value="Database Systems">Database Systems</option>
                        <option value="Computer Networks">Computer Networks</option>
                        <option value="Software Engineering">Software Engineering</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2" style={{ textAlign: "center" }}>
                      <button
                        className="btn btn-primary"
                        onClick={fetchResults}
                        disabled={loading}
                      >
                        {loading ? "Loading..." : "View Results"}
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
                      <th>Subject</th>
                      <th>Marks</th>
                      <th>Submitted Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.length === 0 ? (
                      <tr>
                        <td colSpan="4">No results found</td>
                      </tr>
                    ) : results.map((r, index) => (
                      <tr key={index}>
                        <td>{r.quizId?.title || `Quiz`}</td>
                        <td>{r.quizId?.subject || `Unknown`}</td>
                        <td>{r.score}</td>
                        <td>
                          {new Date(r.submittedAt).toLocaleDateString()}
                        </td>
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
