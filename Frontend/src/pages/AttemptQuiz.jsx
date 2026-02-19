import { useEffect, useState } from "react";
import ERPLayout from "../components/ERPLayout";
import { useParams } from "react-router-dom";

function AttemptQuiz() {
  const { quizId } = useParams();

  const questions = [
    {
      question: "What is 2 + 2?",
      options: ["1", "2", "3", "4"],
      correct: "4",
    },
    {
      question: "Capital of India?",
      options: ["Mumbai", "Delhi", "Chennai", "Kolkata"],
      correct: "Delhi",
    },
  ];

  /* ===== PER QUESTION TIMER (30 sec) ===== */
  const QUESTION_TIME = 30;
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  /* ===== TIMER LOGIC ===== */
  useEffect(() => {
    if (submitted) return;

    if (timeLeft === 0) {
      goNextQuestion();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, currentQ, submitted]);

  const formatTime = () => {
    return `00:${timeLeft < 10 ? "0" : ""}${timeLeft}`;
  };

  const handleChange = (option) => {
    setAnswers({ ...answers, [currentQ]: option });
  };

  const goNextQuestion = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setTimeLeft(QUESTION_TIME);
    } else {
      submitQuiz(true);
    }
  };

  const submitQuiz = (auto = false) => {
    let marks = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correct) marks++;
    });

    setScore(marks);
    setSubmitted(true);

    if (auto) {
      alert("Quiz completed. Auto-submitted.");
    }
  };

  return (
    <ERPLayout>
      <div className="row justify-content-center mt-4">
        <div className="col-md-10">

          {/* ===== ERP PANEL ===== */}
          <div className="erp-panel">

            <div className="erp-panel-header">
              Attempt Quiz : {quizId}
            </div>

            <div className="erp-panel-body">

              {/* INFO BAR */}
              {!submitted && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                    fontWeight: "bold",
                  }}
                >
                  <span>
                    Question {currentQ + 1} of {questions.length}
                  </span>
                  <span style={{ color: "#c9302c" }}>
                    Time Left: {formatTime()}
                  </span>
                </div>
              )}

              <hr />

              {/* QUESTION */}
              {!submitted && (
                <>
                  <p style={{ fontWeight: "bold", marginBottom: "10px" }}>
                    Q{currentQ + 1}. {questions[currentQ].question}
                  </p>

                  {questions[currentQ].options.map((opt, index) => (
                    <div key={index} style={{ marginBottom: "6px" }}>
                      <label>
                        <input
                          type="radio"
                          name={`q-${currentQ}`}
                          checked={answers[currentQ] === opt}
                          onChange={() => handleChange(opt)}
                          style={{ marginRight: "8px" }}
                        />
                        {opt}
                      </label>
                    </div>
                  ))}

                  <button
                    className="btn btn-primary"
                    style={{ marginTop: "15px" }}
                    onClick={goNextQuestion}
                  >
                    {currentQ === questions.length - 1
                      ? "Submit Quiz"
                      : "Next"}
                  </button>
                </>
              )}

              {/* RESULT */}
              {submitted && (
                <div style={{ marginTop: "20px" }}>
                  <b>Quiz Completed</b>
                  <p style={{ marginTop: "8px" }}>
                    Your Score: {score} / {questions.length}
                  </p>
                </div>
              )}

            </div>
          </div>
          {/* ===== ERP PANEL END ===== */}

        </div>
      </div>
    </ERPLayout>
  );
}

export default AttemptQuiz;
