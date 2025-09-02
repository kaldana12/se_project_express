const { STATUS_CODES, ERROR_MESSAGES } = require("../utils/errors");

module.exports = (err, req, res, next) => {
  const { statusCode = 500, message } = err;

  // Celebrate validation error
  if (err.joi) {
    return res.status(STATUS_CODES.BAD_REQUEST).send({ message: err.joi.message });
  }

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

  return res.status(statusCode).send({
    message: statusCode === 500 ? ERROR_MESSAGES.SERVER_ERROR : message,
  });
};
