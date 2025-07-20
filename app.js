const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");
const cors = require("cors");

const app = express();

const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("connect to DB");
  })
  .catch(console.error);

// Middleware to parse JSON
app.use(express.json());

app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

app.use(cors());
