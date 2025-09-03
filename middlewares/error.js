// middlewares/errorHandler.js (or wherever your error middleware is)

const { STATUS_CODES, ERROR_MESSAGES } = require("../utils/errors");
const {
  BadRequestError,
  ConflictError,
  UnauthorizedError,
  NotFoundError,
  ForbiddenError,
} = require("../utils/errors"); // Assumes these are exported from index.js

module.exports = (err, req, res, next) => {
  const { statusCode = STATUS_CODES.SERVER_ERROR, message } = err;

  // 🎯 Celebrate/Joi validation errors
  if (err.joi) {
    return res
      .status(STATUS_CODES.BAD_REQUEST)
      .send({ message: err.joi.message });
  }

  // 🎯 Custom application errors
  if (
    err instanceof BadRequestError ||
    err instanceof ConflictError ||
    err instanceof UnauthorizedError ||
    err instanceof NotFoundError ||
    err instanceof ForbiddenError
  ) {
    return res.status(err.statusCode).send({ message });
  }

  // 🎯 Mongoose validation error (e.g., schema validation)
  if (err.name === "ValidationError") {
    return res
      .status(STATUS_CODES.BAD_REQUEST)
      .send({ message: ERROR_MESSAGES.INVALID_DATA });
  }

  // 🎯 Mongoose invalid ObjectId format
  if (err.name === "CastError") {
    return res
      .status(STATUS_CODES.BAD_REQUEST)
      .send({ message: ERROR_MESSAGES.INVALID_ID });
  }

  // 🎯 Mongoose document not found
  if (err.name === "DocumentNotFoundError") {
    return res
      .status(STATUS_CODES.NOT_FOUND)
      .send({ message: ERROR_MESSAGES.ITEM_NOT_FOUND });
  }

  // 🎯 Generic known errors with status code
  if (err.statusCode && err instanceof Error) {
    return res.status(err.statusCode).send({ message });
  }

  // ❌ Fallback for unexpected or uncaught server errors
  return res
    .status(STATUS_CODES.SERVER_ERROR)
    .send({ message: ERROR_MESSAGES.SERVER_ERROR });
};
