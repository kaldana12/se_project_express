require("dotenv").config();
const { errors } = require("celebrate");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");
const errorHandler = require("./middlewares/error");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();

const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {})
  .catch(console.error);

// Middleware to parse JSON
const allowedOrigins = [
  "https://wtwrkproject.jumpingcrab.com",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());

app.use(requestLogger);

app.use((req, res, next) => {
  req.user = {
    _id: "68909aef9ab264f73f085e87",
  };
  next();
});

app.use("/", mainRouter);
app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

// start server
app.listen(PORT, () => {});
