const { STATUS_CODES, ERROR_MESSAGES } = require("../utils/errors");
const {
  BadRequestError,
  ConflictError,
  UnauthorizedError,
  NotFoundError,
  ForbiddenError,
} = require("../utils/errors");

module.exports = (err, req, res, next) => {
  // Celebrate/Joi validation error
  if (err.joi) {
    return res
      .status(STATUS_CODES.BAD_REQUEST)
      .send({ message: err.joi.message });
  }

  // Handle custom errors
  if (
    err instanceof BadRequestError ||
    err instanceof ConflictError ||
    err instanceof UnauthorizedError ||
    err instanceof NotFoundError ||
    err instanceof ForbiddenError
  ) {
    return res.status(err.statusCode).send({ message: err.message });
  }

  // Mongoose ValidationError
  if (err.name === "ValidationError") {
    return res
      .status(STATUS_CODES.BAD_REQUEST)
      .send({ message: ERROR_MESSAGES.INVALID_DATA });
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === "CastError") {
    return res
      .status(STATUS_CODES.BAD_REQUEST)
      .send({ message: ERROR_MESSAGES.INVALID_ID });
  }

  // Mongoose DocumentNotFoundError
  if (err.name === "DocumentNotFoundError") {
    return res
      .status(STATUS_CODES.NOT_FOUND)
      .send({ message: ERROR_MESSAGES.ITEM_NOT_FOUND });
  }

  // Catch other known errors with a status code
  if (err.statusCode && err instanceof Error) {
    return res.status(err.statusCode).send({ message: err.message });
  }

  // Fallback for unhandled errors
  return res
    .status(STATUS_CODES.SERVER_ERROR)
    .send({ message: ERROR_MESSAGES.SERVER_ERROR });
};
