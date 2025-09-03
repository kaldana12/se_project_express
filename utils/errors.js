const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  SERVER_ERROR: 500,
};

const ERROR_MESSAGES = {
  INVALID_DATA: "Invalid data",
  AUTH_FAILED: "Incorrect email or password",
  ITEM_NOT_FOUND: "Item not found",
  USER_NOT_FOUND: "User not found",
  INVALID_ID: "Invalid item ID format",
  EMAIL_EXISTS: "Email already exists",
  SERVER_ERROR: "An error occurred on the server",
  NO_PERMISSION: "You are not allowed to delete this item.",
  AUTH_REQUIRED: "Authorization required",
  TOKEN_INVALID: "Invalid or expired token",
};

const BadRequestError = require("./customErrors/BadRequestError");
const ConflictError = require("./customErrors/ConflictError");
const UnauthorizedError = require("./customErrors/UnauthorizedError");
const NotFoundError = require("./customErrors/NotFoundError");
const ForbiddenError = require("./customErrors/ForbiddenError");

module.exports = {
  STATUS_CODES,
  ERROR_MESSAGES,
  BadRequestError,
  ConflictError,
  UnauthorizedError,
  NotFoundError,
  ForbiddenError,
};
