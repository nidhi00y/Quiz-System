import { useState, useEffect } from "react";

import api from "../services/api";

import { useAuth } from "../services/AuthContext";


function CreateQuiz() {

  const { user } = useAuth();

  const [title, setTitle] = useState("");

  const [department, setDepartment] =
    useState("");

  const [subject, setSubject] =
    useState("");

  // ===== TOPICS =====
  const [topics, setTopics] =
    useState([]);

  const [selectedTopics,
    setSelectedTopics] = useState([]);

  const [startTime, setStartTime] =
    useState("");

  const [endTime, setEndTime] =
    useState("");

  const [durationMinutes,
    setDurationMinutes] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const teacherId = user?.id;


  // ===== FETCH TOPICS =====
  useEffect(() => {

    if (!subject) {

      setTopics([]);

      setSelectedTopics([]);

      return;
    }

    const fetchTopics = async () => {

      try {

        const res = await api.get(
          `/topics/${subject}`
        );

        setTopics(res.data);

      } catch (err) {

        console.error(err);

        setTopics([]);
      }
    };

    fetchTopics();

  }, [subject]);


  // ===== TOGGLE TOPIC =====
  const toggleTopic = (topic) => {

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


  // ===== SUBMIT =====
  const handleSubmit = async () => {

    try {

      if (
        !title ||
        !department ||
        !subject ||
        !startTime ||
        !endTime ||
        !durationMinutes
      ) {

        alert(
          "Please fill all fields"
        );

        return;
      }

      if (
        selectedTopics.length === 0
      ) {

        alert(
          "Please select at least one topic"
        );

        return;
      }

      setLoading(true);

      const payload = {

        title,

        department,

        subject,

        // ===== TOPICS =====
        topics: selectedTopics,

        startTime,

        endTime,

        durationMinutes:
          Number(durationMinutes),

        easyCount: 0,

        mediumCount: 0,

        hardCount: 0,

        createdBy: teacherId
      };

      await api.post(
        "/createquiz",
        payload
      );

      alert(
        "Quiz Created Successfully!"
      );

      // RESET
      setTitle("");

      setDepartment("");

      setSubject("");

      setTopics([]);

      setSelectedTopics([]);

      setStartTime("");

      setEndTime("");

      setDurationMinutes("");

    } catch (error) {

      console.error(error);

      alert(
        "Error creating quiz"
      );

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

        onChange={(e) =>
          setTitle(e.target.value)
        }
      />

      <br /><br />


      {/* DEPARTMENT */}
      <select
        value={department}

        onChange={(e) =>
          setDepartment(
            e.target.value
          )
        }

        required
      >

        <option value="">
          Select Department
        </option>

        <option value="Computer Science">
          Computer Science
        </option>

        <option value="Information Technology">
          Information Technology
        </option>

        <option value="Electronics">
          Electronics
        </option>

        <option value="Mechanical">
          Mechanical
        </option>

        <option value="Civil">
          Civil
        </option>

      </select>

      <br /><br />


      {/* SUBJECT */}
      <select
        value={subject}

        onChange={(e) =>
          setSubject(
            e.target.value
          )
        }

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

      <br /><br />


      {/* TOPICS */}
      {topics.length > 0 && (

        <div>

          <h4>
            Select Topics
          </h4>

          {topics.map((topic) => (

            <div key={topic}>

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
          ))}
        </div>
      )}

      <br />


      {/* START TIME */}
      <input
        type="datetime-local"

        value={startTime}

        onChange={(e) =>
          setStartTime(
            e.target.value
          )
        }
      />

      <br /><br />


      {/* END TIME */}
      <input
        type="datetime-local"

        value={endTime}

        onChange={(e) =>
          setEndTime(
            e.target.value
          )
        }
      />

      <br /><br />


      {/* DURATION */}
      <input
        type="number"

        min="1"

        placeholder="Duration in minutes"

        value={durationMinutes}

        onChange={(e) =>
          setDurationMinutes(
            e.target.value
          )
        }
      />

      <br /><br />


      {/* SUBMIT */}
      <button
        onClick={handleSubmit}

        disabled={loading}
      >

        {loading
          ? "Creating..."
          : "Create Quiz"}

      </button>

    </div>
  );
}

export default CreateQuiz;