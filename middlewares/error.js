const { STATUS_CODES, ERROR_MESSAGES } = require("../utils/errors");
const {
  BadRequestError,
  ConflictError,
  UnauthorizedError,
  NotFoundError,
  ForbiddenError,
} = require("../utils/errors");

module.exports = (err, req, res, next) => {
  const { statusCode = STATUS_CODES.SERVER_ERROR, message } = err;

  if (err.joi) {
    return res
      .status(STATUS_CODES.BAD_REQUEST)
      .send({ message: err.joi.message });
  }

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

  if (err.name === "CastError") {
    return res
      .status(STATUS_CODES.BAD_REQUEST)
      .send({ message: ERROR_MESSAGES.INVALID_ID });
  }

  if (err.name === "DocumentNotFoundError") {
    return res
      .status(STATUS_CODES.NOT_FOUND)
      .send({ message: ERROR_MESSAGES.ITEM_NOT_FOUND });
  }

  if (err.statusCode && err instanceof Error) {
    return res.status(err.statusCode).send({ message });
  }

  return res
    .status(STATUS_CODES.SERVER_ERROR)
    .send({ message: ERROR_MESSAGES.SERVER_ERROR });
};
