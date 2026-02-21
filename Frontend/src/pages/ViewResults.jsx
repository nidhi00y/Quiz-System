import ERPLayout from "../components/ERPLayout";
import { useState } from "react";
import api from "../services/api";
import { useAuth } from "../services/AuthContext";

function ViewResults() {
  const { user } = useAuth();
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [filters, setFilters] = useState({
    semester: "",
    section: "",
    subject: "",
    quizNumber: ""
  });

  const [results, setResults] = useState([]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFetchResults = async () => {
    if (!filters.subject || !filters.quizNumber) {
      alert("Subject and Quiz Number are mandatory.");
      return;
    }
    setLoading(true);
    setShowResults(false);
    setErrorMsg("");

    try {
      const res = await api.get(`/api/teacher/${user?.id || 'mockID'}/results`, {
        params: {
          subject: filters.subject,
          quizNumber: filters.quizNumber
        }
      });
      setResults(res.data.results);
      setShowResults(true);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || "Failed to fetch results");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ERPLayout>
      <div className="row justify-content-center mt-4">
        <div className="col-md-10">

          {/* ===== ERP PANEL ===== */}
          <div className="erp-panel">

            <div className="erp-panel-header">
              View Quiz Results
            </div>

            <div className="erp-panel-body">

              {/* FILTER SECTION */}
              <div style={{ marginBottom: "15px", fontWeight: "bold" }}>
                Filter Criteria
              </div>

              <table className="table table-bordered erp-table">
                <tbody>
                  <tr>
                    <td style={{ width: "15%" }}>Semester</td>
                    <td style={{ width: "35%" }}>
                      <input
                        name="semester"
                        onChange={handleChange}
                        style={{ width: "100%" }}
                      />
                    </td>
                    <td style={{ width: "15%" }}>Section</td>
                    <td style={{ width: "35%" }}>
                      <input
                        name="section"
                        onChange={handleChange}
                        style={{ width: "100%" }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Subject</td>
                    <td>
                      <select name="subject" value={filters.subject} onChange={handleChange} style={{ width: "100%", padding: "4px" }} required>
                        <option value="">Select Subject</option>
                        <option value="Data Structures">Data Structures</option>
                        <option value="Operating Systems">Operating Systems</option>
                        <option value="Database Systems">Database Systems</option>
                        <option value="Computer Networks">Computer Networks</option>
                        <option value="Software Engineering">Software Engineering</option>
                      </select>
                    </td>
                    <td>Quiz Number</td>
                    <td>
                      <input
                        name="quizNumber"
                        onChange={handleChange}
                        style={{ width: "100%", padding: "4px" }}
                        required
                      />
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center" }}>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={handleFetchResults}
                        disabled={loading}
                      >
                        {loading ? "Loading..." : "View Results"}
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>

              {errorMsg && <div style={{ color: "red", marginTop: "10px" }}>{errorMsg}</div>}

              {/* RESULTS */}
              {showResults && (
                <>
                  <div style={{ marginTop: "20px", marginBottom: "8px", fontWeight: "bold" }}>
                    Result Details
                  </div>

                  <table className="table table-bordered erp-table text-center">
                    <thead>
                      <tr>
                        <th>Roll No</th>
                        <th>Name</th>
                        <th>Marks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.length === 0 ? (
                        <tr><td colSpan="3">No attempts found for this quiz.</td></tr>
                      ) : (
                        results.map((r, index) => (
                          <tr key={index}>
                            <td>{r.roll}</td>
                            <td>{r.name}</td>
                            <td>{r.marks}</td>
                          </tr>
                        ))
                      )}
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

export default ViewResults;
