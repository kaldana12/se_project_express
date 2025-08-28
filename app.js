require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");
const errorHandler = require("./middlewares/error");
const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();

const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("connect to DB");
  })
  .catch(console.error);

// Middleware to parse JSON
app.use(cors());
app.use(express.json());

app.use(requestLogger);

app.use("/", mainRouter);
app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

//start server
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
