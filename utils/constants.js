const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

const ERROR_MESSAGES = {
  INVALID_DATA: "Invalid data",
  ITEM_NOT_FOUND: "Item not found",
  INVALID_ID: "Invalid item ID format",
  SERVER_ERROR: "An error occurred on the server",
};

module.exports = {
  STATUS_CODES,
  ERROR_MESSAGES,
};
