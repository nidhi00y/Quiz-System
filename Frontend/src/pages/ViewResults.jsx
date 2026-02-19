import ERPLayout from "../components/ERPLayout";
import { useState } from "react";

function ViewResults() {
  const [showResults, setShowResults] = useState(false);
  const [filters, setFilters] = useState({
    semester: "",
    section: "",
    subject: "",
    quizNumber: ""
  });

  const results = [
    { roll: "101", name: "Aman", marks: 18 },
    { roll: "102", name: "Riya", marks: 22 },
    { roll: "103", name: "Karan", marks: 15 }
  ];

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
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
                      <input
                        name="subject"
                        onChange={handleChange}
                        style={{ width: "100%" }}
                      />
                    </td>
                    <td>Quiz Number</td>
                    <td>
                      <input
                        name="quizNumber"
                        onChange={handleChange}
                        style={{ width: "100%" }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center" }}>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => setShowResults(true)}
                      >
                        View Results
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>

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
                      {results.map(r => (
                        <tr key={r.roll}>
                          <td>{r.roll}</td>
                          <td>{r.name}</td>
                          <td>{r.marks}</td>
                        </tr>
                      ))}
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
