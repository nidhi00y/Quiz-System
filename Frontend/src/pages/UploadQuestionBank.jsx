import { useState } from "react";
import ERPLayout from "../components/ERPLayout";
import api from "../services/api";

function UploadQuestionBank() {
  const [mode, setMode] = useState("");
  const [subject, setSubject] = useState("");
  const [questions, setQuestions] = useState([]);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const subjects = [
    { id: "DSA", name: "DSA" },
    { id: "OS", name: "OS" },
    { id: "DBMS", name: "DBMS" },
    { id: "CN", name: "CN" },
    { id: "API Testing", name: "API Testing" },
  ];

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: "",
        options: ["", "", "", ""],
        correct: "",
        difficulty: "",
        status: "accepted",
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

  const handleGenerateAIQuestions = async () => {
    if (!subject) {
      alert("Please select subject");
      return;
    }

    try {
      setIsGeneratingAI(true);
      const res = await api.get("/api/ai-generate", {
        params: { subject },
      });

      const generated = Array.isArray(res.data?.questions)
        ? res.data.questions
        : [];

      const parsedQuestions = generated.map((q) => ({
        text: q.questionText || "",
        options: Array.isArray(q.options) ? q.options : ["", "", "", ""],
        correct:
          q.correctOption !== undefined && q.correctOption !== null
            ? String(q.correctOption)
            : "",
        difficulty: q.difficulty || "",
        status: "pending",
      }));

      setQuestions(parsedQuestions);

      if (!parsedQuestions.length) {
        alert("No valid questions were generated. Please generate again.");
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Error generating AI questions");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const updateQuestionStatus = (qIndex, status) => {
    const updated = [...questions];
    updated[qIndex].status = status;
    setQuestions(updated);
  };

  const acceptAllQuestions = () => {
    setQuestions((prev) =>
      prev.map((question) => ({
        ...question,
        status: "accepted",
      }))
    );
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

    const questionsToSubmit =
      mode === "ai"
        ? questions.filter((q) => q.status === "accepted")
        : questions;

    if (mode === "ai" && questionsToSubmit.length === 0) {
      alert("Accept at least one AI-generated question before submitting");
      return;
    }

    for (let q of questionsToSubmit) {
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
      const formattedQuestions = questionsToSubmit.map((q) => ({
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
                  onChange={() => {
                    setMode("manual");
                    setQuestions([]);
                  }}
                />{" "}
                Add Questions Manually
              </label>

              <label>
                <input
                  type="radio"
                  checked={mode === "excel"}
                  onChange={() => {
                    setMode("excel");
                    setQuestions([]);
                  }}
                />{" "}
                Upload Excel Sheet
              </label>

                            <label>
                <input
                  type="radio"
                                checked={mode === "ai"}
                                onChange={() => {
                                  setMode("ai");
                                  setQuestions([]);
                                }}
                />{" "}
                Generate Questions
              </label>

            </div>
          </div>
        )}

        {/* MANUAL MODE */}
        {(mode === "manual" || mode === "ai") && (
          <div
            style={{
              background: "white",
              border: "1px solid #ddd",
              padding: "20px",
              marginBottom: "20px",
            }}
          >
            {mode === "manual" && (
              <button onClick={addQuestion} style={{ marginBottom: "20px" }}>
                Add Question
              </button>
            )}

            {mode === "ai" && (
              <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
                <button onClick={handleGenerateAIQuestions} disabled={isGeneratingAI}>
                  {questions.length ? "Generate Again" : "Generate Questions"}
                </button>
                <button onClick={acceptAllQuestions} disabled={!questions.length}>
                  Accept All Questions
                </button>
                {isGeneratingAI && <span>Generating questions...</span>}
              </div>
            )}

            {questions.map((q, qIndex) => (
              <div
                key={qIndex}
                style={{
                  border: "1px solid #ccc",
                  padding: "15px",
                  marginBottom: "20px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
                  <b>Question {qIndex + 1}</b>
                  {mode === "ai" && (
                    <span style={{ fontSize: "13px", fontWeight: 600 }}>
                      Status: {q.status}
                    </span>
                  )}
                </div>

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

                {mode === "ai" && (
                  <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
                    <button
                      type="button"
                      onClick={() => updateQuestionStatus(qIndex, "accepted")}
                      style={{ padding: "6px 12px" }}
                    >
                      Accept
                    </button>
                    <button
                      type="button"
                      onClick={() => updateQuestionStatus(qIndex, "rejected")}
                      style={{ padding: "6px 12px" }}
                    >
                      Reject
                    </button>
                  </div>
                )}
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
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;

                import("xlsx").then((XLSX) => {
                  const reader = new FileReader();
                  reader.onload = (evt) => {
                    const data = new Uint8Array(evt.target.result);
                    const workbook = XLSX.read(data, { type: "array" });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                    
                    const parsedQuestions = [];
                    for (let i = 0; i < json.length; i++) {
                      const row = json[i];
                      if (!row || row.length === 0) continue;
                      
                      if (i === 0 && String(row[0]).toLowerCase().includes("question")) {
                        continue;
                      }

                      const qText = row[0] ? String(row[0]).trim() : "";
                      const opt1 = row[1] ? String(row[1]).trim() : "";
                      const opt2 = row[2] ? String(row[2]).trim() : "";
                      const opt3 = row[3] ? String(row[3]).trim() : "";
                      const opt4 = row[4] ? String(row[4]).trim() : "";
                      let correct = row[5] !== undefined && row[5] !== "" ? String(row[5]).trim() : "";
                      const difficulty = row[6] ? String(row[6]).trim().toLowerCase() : "";

                      if (!qText && !opt1 && !opt2) continue;

                      parsedQuestions.push({
                        text: qText,
                        options: [opt1, opt2, opt3, opt4],
                        correct: correct,
                        difficulty: difficulty
                      });
                    }
                    
                    setQuestions(parsedQuestions);
                    alert(`Loaded ${parsedQuestions.length} questions from Excel. You can now submit.`);
                  };
                  reader.readAsArrayBuffer(file);
                }).catch(err => {
                  console.error("Error loading xlsx library", err);
                  alert("Failed to process Excel file.");
                });
              }}
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
            <button onClick={handleSubmit} disabled={isGeneratingAI}>
              Submit Question Bank
            </button>
          </div>
        )}
      </div>
    </ERPLayout>
  );
}

export default UploadQuestionBank;