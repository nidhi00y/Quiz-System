import ERPLayout from "../components/ERPLayout";

import { useState, useEffect } from "react";

import api from "../services/api";

import { useAuth } from "../services/AuthContext";


function ViewResults() {

  const { user } = useAuth();


  // ===== RESULTS =====
  const [showResults, setShowResults] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [errorMsg, setErrorMsg] =
    useState("");


  // ===== FILTERS =====
  const [filters, setFilters] =
    useState({

      semester: "",

      subject: "",

      quizNumber: ""
    });


  const [results, setResults] =
    useState([]);


  // ===== FLAGGED QUESTIONS =====
  const [flaggedQuestions,
    setFlaggedQuestions] =
    useState([]);


  // ===== NEW CORRECT OPTIONS =====
  const [newCorrectOptions,
    setNewCorrectOptions] =
    useState({});


  // ====================================
  // ===== FETCH FLAGGED QUESTIONS ======
  // ====================================
  useEffect(() => {

    fetchFlaggedQuestions();

  }, []);


  const fetchFlaggedQuestions =
    async () => {

      try {

        const res =
          await api.get(
            "/flagged-questions"
          );

        setFlaggedQuestions(
          res.data
        );

      } catch (err) {

        console.error(err);
      }
    };


  // ===== HANDLE FILTER =====
  const handleChange = (e) => {

    setFilters({

      ...filters,

      [e.target.name]:
        e.target.value
    });
  };


  // ====================================
  // ===== FETCH RESULTS ================
  // ====================================
  const handleFetchResults =
    async () => {

      if (
        !filters.subject ||
        !filters.quizNumber
      ) {

        alert(
          "Subject and Quiz Number are mandatory."
        );

        return;
      }

      setLoading(true);

      setShowResults(false);

      setErrorMsg("");


      try {

        const res =
          await api.get(

            `/api/teacher/${user?.id || 'mockID'}/results`,

            {
              params: {

                subject:
                  filters.subject,

                quizNumber:
                  filters.quizNumber,

                semester:
                  filters.semester
              }
            }
          );

        setResults(
          res.data.results
        );

        setShowResults(true);

      } catch (err) {

        console.error(err);

        setErrorMsg(

          err.response?.data?.message ||

          "Failed to fetch results"
        );

      } finally {

        setLoading(false);
      }
    };


  // ====================================
  // ===== INVALIDATE QUESTION ==========
  // ====================================
  const handleInvalidate =
    async (questionId) => {

      try {

        await api.post(
          "/review-question",
          {

            questionId,

            action:
              "invalidate"
          }
        );

        alert(
          "Question invalidated and scores updated"
        );

        fetchFlaggedQuestions();

      } catch (err) {

        console.error(err);

        alert(
          "Failed to invalidate question"
        );
      }
    };


  // ====================================
  // ===== CHANGE CORRECT OPTION ========
  // ====================================
  const handleCorrectOptionChange =
    async (questionId) => {

      try {

        const newCorrectOption =

          Number(
            newCorrectOptions[
              questionId
            ]
          );


        if (
          isNaN(newCorrectOption)
        ) {

          alert(
            "Select a new correct option"
          );

          return;
        }


        await api.post(
          "/review-question",
          {

            questionId,

            action:
              "changeCorrectOption",

            newCorrectOption
          }
        );

        alert(
          "Correct option updated and scores revised"
        );

        fetchFlaggedQuestions();

      } catch (err) {

        console.error(err);

        alert(
          "Failed to update correct option"
        );
      }
    };


  return (

    <ERPLayout>

      <div className="row justify-content-center mt-4">

        <div className="col-md-10">


          {/* ====================================== */}
          {/* ===== FLAGGED QUESTIONS PANEL ======== */}
          {/* ====================================== */}

          <div
            className="erp-panel"

            style={{
              marginBottom: "25px",

              border:
                "2px solid red"
            }}
          >

            <div
              className="erp-panel-header"

              style={{
                background: "#c9302c",
                color: "white"
              }}
            >

              🔴 Flagged Questions
            </div>


            <div className="erp-panel-body">

              {flaggedQuestions.length === 0 ? (

                <p>
                  No flagged questions.
                </p>

              ) : (

                flaggedQuestions.map(
                  (q) => (

                    <div

                      key={q._id}

                      style={{

                        border:
                          "2px solid red",

                        padding: "15px",

                        marginBottom: "20px",

                        background:
                          "#fff5f5"
                      }}
                    >

                      <h5>
                        {q.questionText}
                      </h5>

                      <p>
                        <b>Subject:</b>
                        {" "}
                        {q.subject}
                      </p>

                      <p>
                        <b>Topic:</b>
                        {" "}
                        {q.topic}
                      </p>

                      <p>
  <b>ML Difficulty:</b>
  {" "}
  {q.mlDifficulty}
</p>


{/* ===== OPTIONS DISPLAY ===== */}
<div style={{ marginBottom: "15px" }}>

  <b>Options:</b>

  <div style={{ marginTop: "10px" }}>

    {q.options.map((opt, index) => (

      <div
        key={index}

        style={{

          padding: "10px",

          marginBottom: "8px",

          border:
            index === q.correctOption
              ? "2px solid green"
              : "1px solid #ccc",

          background:
            index === q.correctOption
              ? "#eafbea"
              : "white",

          borderRadius: "6px",

          fontWeight:
            index === q.correctOption
              ? "bold"
              : "normal"
        }}
      >

        <span>
          <b>
            Option {index + 1}:
          </b>
        </span>

        {" "}

        {opt}

        {index === q.correctOption && (

          <span
            style={{
              color: "green",
              marginLeft: "10px"
            }}
          >

            ✓ Current Correct Option
          </span>
        )}

      </div>
    ))}

  </div>
</div>


<p
  style={{
    color: "red",
    fontWeight: "bold"
  }}
>

  Reason:
  {" "}
  {q.flagReason}
</p>


                      {/* ===== INVALIDATE ===== */}
                      <button

                        className="btn btn-danger btn-sm"

                        style={{
                          marginRight: "10px"
                        }}

                        onClick={() =>
                          handleInvalidate(
                            q._id
                          )
                        }
                      >
                        Invalidate Question
                      </button>


                      {/* ===== CHANGE OPTION ===== */}
                      <select

                        value={
                          newCorrectOptions[
                            q._id
                          ] || ""
                        }

                        onChange={(e) =>

                          setNewCorrectOptions({

                            ...newCorrectOptions,

                            [q._id]:
                              e.target.value
                          })
                        }

                        style={{
                          marginRight: "10px"
                        }}
                      >

                        <option value="">
                          Select Correct Option
                        </option>

                        <option value="0">
                          Option 1
                        </option>

                        <option value="1">
                          Option 2
                        </option>

                        <option value="2">
                          Option 3
                        </option>

                        <option value="3">
                          Option 4
                        </option>

                      </select>


                      <button

                        className="btn btn-warning btn-sm"

                        onClick={() =>
                          handleCorrectOptionChange(
                            q._id
                          )
                        }
                      >
                        Update Correct Option
                      </button>


                      {/* ===== INVALIDATED ===== */}
                      {q.invalidated && (

                        <p
                          style={{
                            marginTop: "10px",
                            color: "gray",
                            fontWeight: "bold"
                          }}
                        >

                          ⚫ Question Invalidated
                        </p>
                      )}

                    </div>
                  )
                )
              )}

            </div>
          </div>


          {/* ====================================== */}
          {/* ===== EXISTING RESULTS PANEL ========= */}
          {/* ====================================== */}

          <div className="erp-panel">

            <div className="erp-panel-header">
              View Quiz Results
            </div>

            <div className="erp-panel-body">


              {/* FILTER SECTION */}
              <div
                style={{
                  marginBottom: "15px",
                  fontWeight: "bold"
                }}
              >
                Filter Criteria
              </div>


              <table className="table table-bordered erp-table">

                <tbody>

                  <tr>

                    <td
                      style={{
                        width: "15%"
                      }}
                    >
                      Semester
                    </td>

                    <td colSpan="3">

                      <input
                        name="semester"

                        onChange={
                          handleChange
                        }

                        style={{
                          width: "100%"
                        }}
                      />
                    </td>
                  </tr>


                  <tr>

                    <td>
                      Subject
                    </td>

                    <td>

                      <select

                        name="subject"

                        value={
                          filters.subject
                        }

                        onChange={
                          handleChange
                        }

                        style={{
                          width: "100%",
                          padding: "4px"
                        }}

                        required
                      >

                        <option value="">
                          Select Subject
                        </option>

                        <option value="DSA">
                          DSA
                        </option>

                        <option value="OS">
                          OS
                        </option>

                        <option value="DBMS">
                          DBMS
                        </option>

                        <option value="CN">
                          CN
                        </option>

                        <option value="API Testing">
                          API Testing
                        </option>

                      </select>
                    </td>


                    <td>
                      Quiz Number
                    </td>

                    <td>

                      <input
                        name="quizNumber"

                        onChange={
                          handleChange
                        }

                        style={{
                          width: "100%",
                          padding: "4px"
                        }}

                        required
                      />
                    </td>
                  </tr>


                  <tr>

                    <td
                      colSpan="4"

                      style={{
                        textAlign: "center"
                      }}
                    >

                      <button

                        className="btn btn-primary btn-sm"

                        onClick={
                          handleFetchResults
                        }

                        disabled={
                          loading
                        }
                      >

                        {loading
                          ? "Loading..."
                          : "View Results"}
                      </button>

                    </td>
                  </tr>

                </tbody>
              </table>


              {errorMsg && (

                <div
                  style={{
                    color: "red",
                    marginTop: "10px"
                  }}
                >
                  {errorMsg}
                </div>
              )}


              {/* ===== RESULTS ===== */}
              {showResults && (

                <>

                  <div
                    style={{
                      marginTop: "20px",
                      marginBottom: "8px",
                      fontWeight: "bold"
                    }}
                  >
                    Result Details
                  </div>


                  <table className="table table-bordered erp-table text-center">

                    <thead>

                      <tr>

                        <th>
                          Roll No
                        </th>

                        <th>
                          Name
                        </th>

                        <th>
                          Semester
                        </th>

                        <th>
                          Marks
                        </th>

                      </tr>
                    </thead>


                    <tbody>

                      {results.length === 0 ? (

                        <tr>

                          <td colSpan="4">

                            No attempts found for this quiz.
                          </td>
                        </tr>

                      ) : (

                        results.map(
                          (r, index) => (

                            <tr key={index}>

                              <td>
                                {r.roll}
                              </td>

                              <td>
                                {r.name}
                              </td>

                              <td>
                                {r.semester || 'N/A'}
                              </td>

                              <td>
                                {r.marks}
                              </td>

                            </tr>
                          )
                        )
                      )}

                    </tbody>
                  </table>
                </>
              )}

            </div>
          </div>

        </div>
      </div>
    </ERPLayout>
  );
}

export default ViewResults;