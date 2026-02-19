import { useState } from "react";
import ERPLayout from "../components/ERPLayout";

function UploadQuestionBank() {
  const [mode, setMode] = useState("");
  const [subject, setSubject] = useState("");
  const [questions, setQuestions] = useState([]);

  // Mock subjects (backend will replace this)
  const subjects = [
    { id: "CS101", name: "Data Structures" },
    { id: "CS102", name: "Operating Systems" },
    { id: "CS103", name: "Database Management Systems" },
  ];

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: "",
        options: ["", "", "", ""],
        correct: "",
        difficulty: "",
        unit: "",
      },
    ]);
  };

  const updateQuestion = (qIndex, field, value) => {
    const updated = [...questions];
    updated[qIndex][field] = value;
    setQuestions(updated);
  };

  const updateOption = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const handleSubmit = () => {
    if (!subject || !mode) {
      alert("Please select subject and upload method");
      return;
    }

    const payload = {
      subjectId: subject,
      inputMode: mode,
      questions,
    };

    console.log("Submitting to backend:", payload);
    alert("Submitted (frontend only)");
  };

  return (
    <ERPLayout>
      <h2 className="erp-title text-center">Upload Question Bank</h2>


      {/* CENTERED CONTAINER */}
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        {/* SUBJECT SELECTION */}
        <div
          style={{
            background: "white",
            border: "1px solid #ddd",
            padding: "20px",
            marginBottom: "20px",
          }}
        >
          <label><b>Select Subject</b></label>
          <select
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
              setMode("");
              setQuestions([]);
            }}
            style={{ width: "100%", padding: "8px", marginTop: "6px" }}
          >
            <option value="">-- Select Subject --</option>
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>

        {/* UPLOAD METHOD — ONLY AFTER SUBJECT */}
        {subject && (
          <div
            style={{
              background: "white",
              border: "1px solid #ddd",
              padding: "20px",
              marginBottom: "20px",
            }}
          >
            <label><b>Upload Method</b></label>
            <div style={{ marginTop: "10px" }}>
              <label style={{ marginRight: "20px" }}>
                <input
                  type="radio"
                  checked={mode === "manual"}
                  onChange={() => setMode("manual")}
                />{" "}
                Add Questions Manually
              </label>

              <label>
                <input
                  type="radio"
                  checked={mode === "excel"}
                  onChange={() => setMode("excel")}
                />{" "}
                Upload Excel Sheet
              </label>
            </div>
          </div>
        )}

        {/* MANUAL ENTRY */}
        {mode === "manual" && (
          <div
            style={{
              background: "white",
              border: "1px solid #ddd",
              padding: "20px",
              marginBottom: "20px",
            }}
          >
            <button onClick={addQuestion} style={{ marginBottom: "20px" }}>
              Add Question
            </button>

            {questions.map((q, qIndex) => (
              <div
                key={qIndex}
                style={{
                  border: "1px solid #ccc",
                  padding: "15px",
                  marginBottom: "20px",
                }}
              >
                <b>Question {qIndex + 1}</b>

                <input
                  type="text"
                  placeholder="Question text"
                  value={q.text}
                  onChange={(e) =>
                    updateQuestion(qIndex, "text", e.target.value)
                  }
                  style={{ width: "100%", marginTop: "8px" }}
                />

                {q.options.map((opt, oIndex) => (
                  <input
                    key={oIndex}
                    type="text"
                    placeholder={`Option ${oIndex + 1}`}
                    value={opt}
                    onChange={(e) =>
                      updateOption(qIndex, oIndex, e.target.value)
                    }
                    style={{ width: "100%", marginTop: "6px" }}
                  />
                ))}

                <input
                  type="text"
                  placeholder="Correct Option"
                  value={q.correct}
                  onChange={(e) =>
                    updateQuestion(qIndex, "correct", e.target.value)
                  }
                  style={{ width: "100%", marginTop: "6px" }}
                />

                <input
                  type="text"
                  placeholder="Difficulty (easy / medium / hard)"
                  value={q.difficulty}
                  onChange={(e) =>
                    updateQuestion(qIndex, "difficulty", e.target.value)
                  }
                  style={{ width: "100%", marginTop: "6px" }}
                />

                <input
                  type="text"
                  placeholder="Unit / Topic"
                  value={q.unit}
                  onChange={(e) =>
                    updateQuestion(qIndex, "unit", e.target.value)
                  }
                  style={{ width: "100%", marginTop: "6px" }}
                />
              </div>
            ))}
          </div>
        )}

        {/* EXCEL UPLOAD */}
        {mode === "excel" && (
          <div
            style={{
              background: "white",
              border: "1px solid #ddd",
              padding: "20px",
              marginBottom: "20px",
            }}
          >
            <label><b>Upload Excel File</b></label>
            <input
              type="file"
              accept=".xlsx,.xls"
              style={{ display: "block", marginTop: "10px" }}
            />

            <p style={{ marginTop: "10px", fontSize: "14px" }}>
              Format: Question | Option1 | Option2 | Option3 | Option4 | Correct | Difficulty | Unit
            </p>
          </div>
        )}

        {/* SUBMIT */}
        {mode && (
          <div style={{ textAlign: "center" }}>
            <button onClick={handleSubmit}>Submit Question Bank</button>
          </div>
        )}
      </div>
    </ERPLayout>
  );
}

export default UploadQuestionBank;
