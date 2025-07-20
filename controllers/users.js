const mongoose = require("mongoose");
const { STATUS_CODES, ERROR_MESSAGES } = require("../utils/constants");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/user");

// GET /users
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(STATUS_CODES.OK).send(users))
    .catch((err) => {
      console.error(err);
      return res
        .status(STATUS_CODES.SERVER_ERROR)
        .send({ message: ERROR_MESSAGES.SERVER_ERROR });
    });
};

// POST /signup
const createUsers = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    return res
      .status(STATUS_CODES.BAD_REQUEST)
      .send({ message: ERROR_MESSAGES.INVALID_DATA });
  }

  bcrypt
    .hash(password, 10)
    .then((hashedPassword) =>
      User.create({ name, avatar, email, password: hashedPassword })
    )
    .then((user) => {
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;
      res.status(STATUS_CODES.CREATED).send(userWithoutPassword);
    })
    .catch((err) => {
      console.error(err);

      if (err.code === 11000) {
        return res.status(STATUS_CODES.CONFLICT).send({
          message: ERROR_MESSAGES.EMAIL_EXISTS || "Email already exists",
        });
      }

      if (err.name === "ValidationError") {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .send({ message: ERROR_MESSAGES.INVALID_DATA });
      }

      return res
        .status(STATUS_CODES.SERVER_ERROR)
        .send({ message: ERROR_MESSAGES.SERVER_ERROR });
    });
};

// GET /users/:userId — (optional; now unused in current flow)
const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail()
    .then((user) => res.status(STATUS_CODES.OK).send(user))
    .catch((err) => {
      console.error(err);

      if (err.name === "DocumentNotFoundError") {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .send({ message: ERROR_MESSAGES.USER_NOT_FOUND });
      }

      if (err.name === "CastError") {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .send({ message: ERROR_MESSAGES.INVALID_ID });
      }

      return res
        .status(STATUS_CODES.SERVER_ERROR)
        .send({ message: ERROR_MESSAGES.SERVER_ERROR });
    });
};

// POST /signin
const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(STATUS_CODES.OK).send({ token });
    })
    .catch((err) => {
      console.error(err);
      return res.status(STATUS_CODES.UNAUTHORIZED).send({
        message: ERROR_MESSAGES.AUTH_FAILED || "Invalid email or password",
      });
    });
};

// GET /users/me
const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .send({ message: ERROR_MESSAGES.USER_NOT_FOUND });
      }
      res.send(user);
    })
    .catch(next);
};

// PATCH /users/me
const updateUserProfile = (req, res, next) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .then((user) => {
      if (!user) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .send({ message: ERROR_MESSAGES.USER_NOT_FOUND });
      }
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .send({ message: ERROR_MESSAGES.INVALID_DATA });
      }
      next(err);
    });
};

module.exports = {
  getUsers,
  createUsers,
  getUser,
  login,
  getCurrentUser,
  updateUserProfile,
};
