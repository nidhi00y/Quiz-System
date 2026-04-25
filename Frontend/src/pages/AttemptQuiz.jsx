import { useEffect, useState } from "react";
import ERPLayout from "../components/ERPLayout";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../services/AuthContext";

function AttemptQuiz() {
  const { quizId } = useParams();

  const { user } = useAuth();
  const studentId = user?.id; // from logged in context

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMSG, setErrorMSG] = useState("");

  /* ===== PER QUESTION TIMER (30 sec) ===== */
  const QUESTION_TIME = 30;
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  /* ===== FETCH QUESTIONS ===== */
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await api.post("/startquiz", { quizId, studentId });
        setQuestions(res.data.questions);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setErrorMSG(err.response?.data?.message || "Error starting quiz");
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  const formatTime = () => {
    return `00:${timeLeft < 10 ? "0" : ""}${timeLeft}`;
  };

  const handleStartQuiz = () => {
    setQuizStarted(true);
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(err => {
        console.error("Error attempting to enable fullscreen:", err);
      });
    }
  };

  const handleChange = (option) => {
    setAnswers({ ...answers, [currentQ]: option });
  };

  const submitQuiz = async (auto = false) => {
    try {
      // Format answers for backend
      const formattedAnswers = questions.map((q, i) => {
        const selectedOptText = answers[i];
        const selectedIndex = selectedOptText !== undefined ? q.options.indexOf(selectedOptText) : -1;
        return {
          questionId: q._id,
          selectedOption: selectedIndex
        };
      });

      const res = await api.post("/submitquiz", {
        quizId,
        studentId,
        answers: formattedAnswers
      });

      setScore(res.data.score);
      setSubmitted(true);

      if (auto) {
        alert("Quiz completed. Auto-submitted.");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting quiz: " + (err.response?.data?.message || err.message));
    }
  };

  const goNextQuestion = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setTimeLeft(QUESTION_TIME);
    } else {
      submitQuiz(true);
    }
  };

  /* ===== TIMER LOGIC ===== */
  useEffect(() => {
    if (submitted || loading || questions.length === 0 || !quizStarted) return;

    if (timeLeft === 0) {
      goNextQuestion();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, currentQ, submitted, loading, questions, quizStarted, goNextQuestion]);



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

              {loading ? (
                <p>Loading Quiz...</p>
              ) : errorMSG ? (
                <p style={{ color: "red" }}>{errorMSG}</p>
              ) : (
                <>
                  {!quizStarted ? (
                    <div style={{ textAlign: "center", marginTop: "30px", marginBottom: "30px" }}>
                      <h4>Ready to begin?</h4>
                      <p>The quiz will open in fullscreen mode to ensure security.</p>
                      <button className="btn btn-success mt-2" onClick={handleStartQuiz}>
                        Start Quiz
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* INFO BAR */}
                      {!submitted && questions.length > 0 && (
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
                      {!submitted && questions.length > 0 && (
                        <>
                          <p style={{ fontWeight: "bold", marginBottom: "10px" }}>
                            Q{currentQ + 1}. {questions[currentQ].questionText}
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
                    </>
                  )}
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

export default AttemptQuiz;
