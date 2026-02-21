const express = require("express");
const connectDB = require("./config/db");

const app = express();
const cors = require("cors");
app.use(cors());

connectDB();
app.use(express.json());

app.use("/addquestions", require("./routes/question_route"));
app.use("/createquiz", require("./routes/quiz_create"));
app.use("/startquiz", require("./routes/quiz_start"));
app.use("/submitquiz", require("./routes/quiz_submit"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/student", require("./routes/student"));
app.use("/api/teacher", require("./routes/teacher"));

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
