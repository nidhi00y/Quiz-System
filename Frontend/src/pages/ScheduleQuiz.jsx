import ERPLayout from "../components/ERPLayout";

import { useState, useEffect } from "react";

import api from "../services/api";

import { useAuth } from "../services/AuthContext";


function ScheduleQuiz() {

  const { user } = useAuth();

  const [step, setStep] =
    useState(1);

  // ===== TOPICS =====
  const [topics, setTopics] =
    useState([]);

  const [selectedTopics,
    setSelectedTopics] =
    useState([]);


  const [form, setForm] =
    useState({

      quizNumber: "",

      department: "",

      subject: "",

      semester: "",

      quizDate: "",

      startTime: "",

      duration: "",

      totalQuestions: "",

      marksPerQuestion: "",

      easy: "",

      medium: "",

      hard: ""
    });


  // ===== FETCH TOPICS =====
  useEffect(() => {

    if (!form.subject) {

      setTopics([]);

      setSelectedTopics([]);

      return;
    }

    const fetchTopics =
      async () => {

        try {

          const res =
            await api.get(
              `/topics/${form.subject}`
            );

          setTopics(res.data);

        } catch (err) {

          console.error(err);

          setTopics([]);
        }
      };

    fetchTopics();

  }, [form.subject]);


  // ===== TOGGLE TOPIC =====
  const toggleTopic =
    (topic) => {

      if (
        selectedTopics.includes(topic)
      ) {

        setSelectedTopics(

          selectedTopics.filter(
            (t) => t !== topic
          )
        );

      } else {

        setSelectedTopics([
          ...selectedTopics,
          topic
        ]);
      }
    };


  // ===== HANDLE FORM =====
  const handleChange = (e) => {

    setForm({

      ...form,

      [e.target.name]:
        e.target.value
    });
  };


  // ===== SCHEDULE QUIZ =====
  const handleSchedule =
    async () => {

      try {

        if (
          selectedTopics.length === 0
        ) {

          alert(
            "Please select at least one topic"
          );

          return;
        }

        const durationMinutes =
          Number(form.duration);

        const payload = {

          title:
            `Quiz ${form.quizNumber}`,

          department:
            form.department,

          subject:
            form.subject,

          // ===== TOPICS =====
          topics:
            selectedTopics,

          startTime:
            `${form.quizDate}T${form.startTime}`,

          endTime:
            `${form.quizDate}T${
              new Date(

                new Date(
                  `${form.quizDate}T${form.startTime}`
                ).getTime()

                +

                form.duration * 60000

              )
                .toTimeString()
                .substring(0, 5)
            }`,

          durationMinutes,

          easyCount:
            Number(form.easy),

          mediumCount:
            Number(form.medium),

          hardCount:
            Number(form.hard),

          createdBy:
            user?.id
        };

        await api.post(
          "/createquiz",
          payload
        );

        alert(
          "Quiz Scheduled Successfully"
        );

        setStep(1);

      } catch (e) {

        console.error(e);

        alert(
          "Error scheduling quiz"
        );
      }
    };


  return (

    <ERPLayout>

      <div className="row justify-content-center mt-4">

        <div className="col-md-9">

          <div className="erp-panel">

            <div className="erp-panel-header">

              Schedule Quiz
              (Step {step} of 3)

            </div>

            <div className="erp-panel-body">


              {/* STEP 1 */}
              {step === 1 && (

                <table className="table table-bordered erp-table">

                  <tbody>

                    <tr>
                      <td>
                        Quiz Number
                      </td>

                      <td>
                        <input
                          name="quizNumber"
                          onChange={
                            handleChange
                          }
                        />
                      </td>
                    </tr>


                    <tr>
                      <td>
                        Department
                      </td>

                      <td>

                        <select
                          name="department"

                          value={
                            form.department
                          }

                          onChange={
                            handleChange
                          }

                          required

                          style={{
                            width: "100%",
                            padding: "4px"
                          }}
                        >

                          <option value="">
                            Select Department
                          </option>

                          <option value="CSE">
                            CSE
                          </option>

                          <option value="IT">
                            IT
                          </option>

                          <option value="ECE">
                            ECE
                          </option>

                          <option value="ME">
                            ME
                          </option>

                          <option value="TT">
                            TT
                          </option>

                        </select>
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
                            form.subject
                          }

                          onChange={
                            handleChange
                          }

                          required

                          style={{
                            width: "100%",
                            padding: "4px"
                          }}
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
                    </tr>


                    {/* ===== TOPICS ===== */}
                    {topics.length > 0 && (

                      <tr>

                        <td>
                          Topics
                        </td>

                        <td>

                          {topics.map(
                            (topic) => (

                              <div
                                key={topic}
                              >

                                <label>

                                  <input
                                    type="checkbox"

                                    checked={
                                      selectedTopics.includes(
                                        topic
                                      )
                                    }

                                    onChange={() =>
                                      toggleTopic(
                                        topic
                                      )
                                    }
                                  />

                                  {" "}
                                  {topic}
                                </label>
                              </div>
                            )
                          )}

                        </td>
                      </tr>
                    )}


                    <tr>
                      <td>
                        Semester
                      </td>

                      <td>
                        <input
                          name="semester"
                          onChange={
                            handleChange
                          }
                        />
                      </td>
                    </tr>


                    <tr>
                      <td>
                        Quiz Date
                      </td>

                      <td>
                        <input
                          type="date"

                          name="quizDate"

                          onChange={
                            handleChange
                          }
                        />
                      </td>
                    </tr>


                    <tr>
                      <td>
                        Start Time
                      </td>

                      <td>
                        <input
                          type="time"

                          name="startTime"

                          onChange={
                            handleChange
                          }
                        />
                      </td>
                    </tr>


                    <tr>
                      <td>
                        Duration (minutes)
                      </td>

                      <td>
                        <input
                          type="number"

                          name="duration"

                          onChange={
                            handleChange
                          }
                        />
                      </td>
                    </tr>


                    <tr>

                      <td
                        colSpan="2"

                        style={{
                          textAlign: "center"
                        }}
                      >

                        <button
                          className="btn btn-primary"

                          onClick={() =>
                            setStep(2)
                          }
                        >
                          Next
                        </button>

                      </td>
                    </tr>

                  </tbody>
                </table>
              )}


              {/* STEP 2 */}
              {step === 2 && (

                <table className="table table-bordered erp-table">

                  <tbody>

                    <tr>
                      <td>
                        Total Questions
                      </td>

                      <td>
                        <input
                          type="number"

                          name="totalQuestions"

                          onChange={
                            handleChange
                          }
                        />
                      </td>
                    </tr>


                    <tr>
                      <td>
                        Marks per Question
                      </td>

                      <td>
                        <input
                          type="number"

                          name="marksPerQuestion"

                          onChange={
                            handleChange
                          }
                        />
                      </td>
                    </tr>


                    <tr>

                      <td
                        colSpan="2"

                        style={{
                          textAlign: "center"
                        }}
                      >

                        <button
                          className="btn btn-primary"

                          onClick={() =>
                            setStep(3)
                          }
                        >
                          Next
                        </button>

                      </td>
                    </tr>

                  </tbody>
                </table>
              )}


              {/* STEP 3 */}
              {step === 3 && (

                <table className="table table-bordered erp-table">

                  <tbody>

                    <tr>
                      <td>
                        Easy Questions
                      </td>

                      <td>
                        <input
                          type="number"

                          name="easy"

                          onChange={
                            handleChange
                          }
                        />
                      </td>
                    </tr>


                    <tr>
                      <td>
                        Medium Questions
                      </td>

                      <td>
                        <input
                          type="number"

                          name="medium"

                          onChange={
                            handleChange
                          }
                        />
                      </td>
                    </tr>


                    <tr>
                      <td>
                        Hard Questions
                      </td>

                      <td>
                        <input
                          type="number"

                          name="hard"

                          onChange={
                            handleChange
                          }
                        />
                      </td>
                    </tr>


                    <tr>

                      <td
                        colSpan="2"

                        style={{
                          textAlign: "center"
                        }}
                      >

                        <button
                          className="btn btn-success"

                          onClick={
                            handleSchedule
                          }
                        >
                          Schedule Quiz
                        </button>

                      </td>
                    </tr>

                  </tbody>
                </table>
              )}

            </div>
          </div>

        </div>
      </div>
    </ERPLayout>
  );
}

export default ScheduleQuiz;