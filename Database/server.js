const express = require("express");
const connectDB = require("./config/db");

const app = express();

connectDB();
app.use(express.json());

app.use("/addquestions", require("./routes/question_route"));
app.use("/createquiz", require("./routes/quiz_create"));
app.use("/startquestions", require("./routes/quiz_start"));
app.use("/submitquiz", require("./routes/quiz_submit"));

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
