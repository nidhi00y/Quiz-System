import { useState } from "react";

function CreateQuiz() {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([]);

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

  return (
    <div>
      <h2>Create Quiz</h2>

      <input
        placeholder="Quiz Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
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
        </div>
      ))}
    </div>
  );
}

export default CreateQuiz;
