import { useEffect, useState } from "react";
import ERPLayout from "../components/ERPLayout";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../services/AuthContext";

function AttemptQuiz() {
  const { quizId } = useParams();

  const { user } = useAuth();
  const studentId = user?.id;

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMSG, setErrorMSG] = useState("");

  const [timeLeft, setTimeLeft] = useState(0);
  const [currentQ, setCurrentQ] = useState(0);
  const [questionTimeLimit, setQuestionTimeLimit] = useState(0);

  const [answers, setAnswers] = useState({});

  const [score, setScore] = useState(null);

  const [submitted, setSubmitted] = useState(false);

  const [quizStarted, setQuizStarted] = useState(false);

  /* ===== FETCH QUESTIONS ===== */
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await api.post("/startquiz", {
          quizId,
          studentId
        });

        setQuestions(res.data.questions);
        setQuestionTimeLimit(res.data.perQuestionTimeSeconds || 0);
        setTimeLeft(res.data.perQuestionTimeSeconds || 0);

        setLoading(false);

      } catch (err) {
        console.error(err);

        setErrorMSG(
          err.response?.data?.message || "Error starting quiz"
        );

        setLoading(false);
      }
    };

    fetchQuiz();

  }, [quizId]);

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const handleStartQuiz = () => {
    setQuizStarted(true);

    const elem = document.documentElement;

    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(err => {
        console.error(
          "Error attempting to enable fullscreen:",
          err
        );
      });
    }
  };

  const handleChange = (option) => {
    setAnswers({
      ...answers,

      [currentQ]: {
        selectedOption: option,

        timeTaken: questionTimeLimit - timeLeft,

        skipped: false
      }
    });
  };

  const submitQuiz = async (auto = false) => {
    try {

      const formattedAnswers = questions.map((q, i) => {

        const ans = answers[i];

        if (!ans) {
          return {
            questionId: q._id,

            selectedOption: -1,

            timeTaken: questionTimeLimit,

            skipped: true
          };
        }

        const selectedIndex =
          q.options.indexOf(ans.selectedOption);

        return {
          questionId: q._id,

          selectedOption: selectedIndex,

          timeTaken: ans.timeTaken,

          skipped: false
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

      alert(
        "Error submitting quiz: " +
        (
          err.response?.data?.message ||
          err.message
        )
      );
    }
  };

  const goNextQuestion = () => {

    // Auto mark skipped question
    if (!answers[currentQ]) {

      setAnswers(prev => ({
        ...prev,

        [currentQ]: {
          selectedOption: null,

          timeTaken: questionTimeLimit,

          skipped: true
        }
      }));
    }

    if (currentQ < questions.length - 1) {

      setCurrentQ(currentQ + 1);

      setTimeLeft(questionTimeLimit);

    } else {

      submitQuiz(true);
    }
  };

  /* ===== TIMER LOGIC ===== */
  useEffect(() => {

    if (
      submitted ||
      loading ||
      questions.length === 0 ||
      !quizStarted
    ) return;

    if (timeLeft === 0) {

      goNextQuestion();

      return;
    }

    const timer = setInterval(() => {

      setTimeLeft((prev) => prev - 1);

    }, 1000);

    return () => clearInterval(timer);

  }, [
    timeLeft,
    currentQ,
    submitted,
    loading,
    questions,
    quizStarted
  ]);

  return (
    <ERPLayout>

      <div className="row justify-content-center mt-4">

        <div className="col-md-10">

          <div className="erp-panel">

            <div className="erp-panel-header">
              Attempt Quiz : {quizId}
            </div>

            <div className="erp-panel-body">

              {loading ? (

                <p>Loading Quiz...</p>

              ) : errorMSG ? (

                <p style={{ color: "red" }}>
                  {errorMSG}
                </p>

              ) : (

                <>
                  {!quizStarted ? (

                    <div
                      style={{
                        textAlign: "center",
                        marginTop: "30px",
                        marginBottom: "30px"
                      }}
                    >
                      <h4>Ready to begin?</h4>

                      <p>
                        The quiz will open in fullscreen mode
                        to ensure security.
                      </p>

                      <button
                        className="btn btn-success mt-2"
                        onClick={handleStartQuiz}
                      >
                        Start Quiz
                      </button>
                    </div>

                  ) : (

                    <>
                      {!submitted &&
                        questions.length > 0 && (

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "10px",
                            fontWeight: "bold",
                          }}
                        >
                          <span>
                            Question {currentQ + 1}
                            {" "}of{" "}
                            {questions.length}
                          </span>

                          <span
                            style={{ color: "#c9302c" }}
                          >
                            Time Left: {formatTime()}
                          </span>
                        </div>
                      )}

                      <hr />

                      {!submitted &&
                        questions.length > 0 && (

                        <>
                          <p
                            style={{
                              fontWeight: "bold",
                              marginBottom: "10px"
                            }}
                          >
                            Q{currentQ + 1}.{" "}
                            {questions[currentQ].questionText}
                          </p>

                          {questions[currentQ].options.map(
                            (opt, index) => (

                              <div
                                key={index}
                                style={{
                                  marginBottom: "6px"
                                }}
                              >
                                <label>

                                  <input
                                    type="radio"

                                    name={`q-${currentQ}`}

                                    checked={
                                      answers[currentQ]
                                        ?.selectedOption === opt
                                    }

                                    onChange={() =>
                                      handleChange(opt)
                                    }

                                    style={{
                                      marginRight: "8px"
                                    }}
                                  />

                                  {opt}

                                </label>
                              </div>
                            )
                          )}

                          <button
                            className="btn btn-primary"

                            style={{
                              marginTop: "15px"
                            }}

                            onClick={goNextQuestion}
                          >
                            {currentQ === questions.length - 1
                              ? "Submit Quiz"
                              : "Next"}
                          </button>
                        </>
                      )}

                      {submitted && (

                        <div style={{ marginTop: "20px" }}>

                          <b>Quiz Completed</b>

                          <p style={{ marginTop: "8px" }}>
                            Your Score: {score} /
                            {" "}
                            {questions.length}
                          </p>

                        </div>
                      )}
                    </>
                  )}
                </>
              )}

            </div>
          </div>
        </div>
      </div>
    </ERPLayout>
  );
}

export default AttemptQuiz;