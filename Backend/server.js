const express = require("express");
const connectDB = require("./config/db");

const app = express();

connectDB();
app.use(express.json());

app.use("/api/questions", require("./routes/question_route"));
app.use("/api/quiz", require("./routes/quiz"));

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
