const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/user");
const { STATUS_CODES, ERROR_MESSAGES } = require("../utils/errors");
const {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
} = require("../utils/customErrors");

// POST /signup
const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError(ERROR_MESSAGES.INVALID_DATA);
  }

  return bcrypt
    .hash(password, 10)
    .then((hashedPassword) =>
      User.create({ name, avatar, email, password: hashedPassword })
    )
    .then((user) => {
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;
      res.status(201).send(userWithoutPassword);
    })
    .catch((err) => {
      console.error(err);

      if (err.code === 11000) {
        return next(new ConflictError(ERROR_MESSAGES.EMAIL_EXISTS));
      }

      if (err.name === "ValidationError") {
        return next(new BadRequestError(ERROR_MESSAGES.INVALID_DATA));
      }

      next(err);
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
        return next(new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND));
      }

      if (err.name === "CastError") {
        return next(new BadRequestError(ERROR_MESSAGES.INVALID_ID));
      }

      return next(new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND));
    });
};

// POST /signin
const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError(ERROR_MESSAGES.INVALID_DATA);
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(STATUS_CODES.OK).send({ token });
    })
    .catch((err) => {
      console.error(err);

      if (err.message === "Incorrect email or password") {
        return next(new UnauthorizedError(ERROR_MESSAGES.AUTH_FAILED));
      }

      return res
        .status(STATUS_CODES.SERVER_ERROR)
        .send({ message: ERROR_MESSAGES.SERVER_ERROR });
    });
};

// GET /users/me
const getCurrentUser = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => res.status(STATUS_CODES.OK).send(user))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError(ERROR_MESSAGES.INVALID_ID));
      }

      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND));
      }

      console.error(err);
      return res
        .status(STATUS_CODES.SERVER_ERROR)
        .send({ message: ERROR_MESSAGES.SERVER_ERROR });
    });
};

// PATCH /users/me
const updateUserProfile = (req, res) => {
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
        return next(new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND));
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        throw new BadRequestError(ERROR_MESSAGES.INVALID_DATA);
      }

      if (err.name === "CastError") {
        return next(new BadRequestError(ERROR_MESSAGES.INVALID_ID));
      }

      console.error(err);
      return res
        .status(STATUS_CODES.SERVER_ERROR)
        .send({ message: ERROR_MESSAGES.SERVER_ERROR });
    });
};

module.exports = {
  createUser,
  getUser,
  login,
  getCurrentUser,
  updateUserProfile,
};
