import { useState } from "react";
import ERPLayout from "../components/ERPLayout";
import api from "../services/api";

function UploadQuestionBank() {
  const [mode, setMode] = useState("");
  const [subject, setSubject] = useState("");
  const [questions, setQuestions] = useState([]);

  const subjects = [
    { id: "Data Structures", name: "Data Structures" },
    { id: "Operating Systems", name: "Operating Systems" },
    { id: "Database Systems", name: "Database Systems" },
    { id: "Computer Networks", name: "Computer Networks" },
    { id: "Software Engineering", name: "Software Engineering" },
  ];

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: "",
        options: ["", "", "", ""],
        correct: "",
        difficulty: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subject) {
      alert("Please select subject");
      return;
    }

    if (questions.length === 0) {
      alert("Add at least one question");
      return;
    }

    for (let q of questions) {
      if (
        !q.text ||
        q.options.includes("") ||
        q.correct === "" ||
        !q.difficulty
      ) {
        alert("Please fill all fields for every question");
        return;
      }
    }

    try {
      const formattedQuestions = questions.map((q) => ({
        questionText: q.text,
        options: q.options,
        correctOption: Number(q.correct),
        subject: subject,
        difficulty: q.difficulty,
      }));

      const res = await api.post(
        "/addquestions",
        { questions: formattedQuestions }
      );

      console.log(res.data);
      alert("Questions saved successfully!");

      setQuestions([]);
      setMode("");
      setSubject("");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Error saving questions");
    }
  };

  return (
    <ERPLayout>
      <h2 className="erp-title text-center">Upload Question Bank</h2>

      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
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

        {/* UPLOAD METHOD */}
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

        {/* MANUAL MODE */}
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

                {/* Correct Option Dropdown */}
                <select
                  value={q.correct}
                  onChange={(e) =>
                    updateQuestion(qIndex, "correct", e.target.value)
                  }
                  style={{ width: "100%", marginTop: "6px" }}
                >
                  <option value="">Select Correct Option</option>
                  <option value="0">Option 1</option>
                  <option value="1">Option 2</option>
                  <option value="2">Option 3</option>
                  <option value="3">Option 4</option>
                </select>

                {/* Difficulty Dropdown */}
                <select
                  value={q.difficulty}
                  onChange={(e) =>
                    updateQuestion(qIndex, "difficulty", e.target.value)
                  }
                  style={{ width: "100%", marginTop: "6px" }}
                >
                  <option value="">Select Difficulty</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            ))}
          </div>
        )}

        {/* EXCEL MODE */}
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
              Format: Question | Option1 | Option2 | Option3 | Option4 | Correct(0-3) | Difficulty(easy/medium/hard)
            </p>
          </div>
        )}

        {/* SUBMIT */}
        {mode && (
          <div style={{ textAlign: "center" }}>
            <button onClick={handleSubmit}>
              Submit Question Bank
            </button>
          </div>
        )}
      </div>
    </ERPLayout>
  );
}

export default UploadQuestionBank;