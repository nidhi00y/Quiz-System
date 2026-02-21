import { useState } from "react";
import api from "../services/api";

function CreateQuiz() {
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [subject, setSubject] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // ⚠️ Replace with logged-in teacher ID (from auth / localStorage)
  const teacherId = "YOUR_TEACHER_OBJECT_ID";

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], correct: "" }
    ]);
  };

  const updateQuestion = (index, value) => {
    const updated = [...questions];
    updated[index].question = value;
    setQuestions(updated);
  };

  const updateOption = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const updateCorrect = (qIndex, value) => {
    const updated = [...questions];
    updated[qIndex].correct = value;
    setQuestions(updated);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const payload = {
        title,
        department,
        subject,
        startTime: startTime,
        endTime: endTime,
        easyCount: 0,
        mediumCount: 0,
        hardCount: 0,
        createdBy: teacherId
      };

      await api.post("/createquiz", payload);

      alert("Quiz Created Successfully!");

      // Reset form
      setTitle("");
      setDepartment("");
      setSubject("");
      setStartTime("");
      setEndTime("");
      setQuestions([]);

    } catch (error) {
      console.error(error);
      alert("Error creating quiz");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Create Quiz</h2>

      <input
        placeholder="Quiz Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <br /><br />

      <select
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
        required
      >
        <option value="">Select Department</option>
        <option value="Computer Science">Computer Science</option>
        <option value="Information Technology">Information Technology</option>
        <option value="Electronics">Electronics</option>
        <option value="Mechanical">Mechanical</option>
        <option value="Civil">Civil</option>
      </select>
      <br /><br />

      <select
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        required
      >
        <option value="">Select Subject</option>
        <option value="Data Structures">Data Structures</option>
        <option value="Operating Systems">Operating Systems</option>
        <option value="Database Systems">Database Systems</option>
        <option value="Computer Networks">Computer Networks</option>
        <option value="Software Engineering">Software Engineering</option>
      </select>
      <br /><br />

      <input
        type="datetime-local"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
      />
      <br /><br />

      <input
        type="datetime-local"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
      />
      <br /><br />

      <button onClick={addQuestion}>Add Question</button>

      {questions.map((q, qIndex) => (
        <div key={qIndex} style={{ border: "1px solid black", margin: "10px", padding: "10px" }}>
          <input
            placeholder="Question"
            value={q.question}
            onChange={(e) => updateQuestion(qIndex, e.target.value)}
          />

          {q.options.map((opt, oIndex) => (
            <div key={oIndex}>
              <input
                placeholder={`Option ${oIndex + 1}`}
                value={opt}
                onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
              />
            </div>
          ))}

          <input
            placeholder="Correct Answer"
            value={q.correct}
            onChange={(e) => updateCorrect(qIndex, e.target.value)}
          />
        </div>
      ))}

      <br />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Creating..." : "Create Quiz"}
      </button>
    </div>
  );
}

export default CreateQuiz;