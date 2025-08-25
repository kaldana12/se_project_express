const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { STATUS_CODES, ERROR_MESSAGES } = require("../utils/errors");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(STATUS_CODES.UNAUTHORIZED)
      .send({ message: ERROR_MESSAGES.AUTH_REQUIRED });
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    return res
      .status(STATUS_CODES.UNAUTHORIZED)
      .send({ message: ERROR_MESSAGES.TOKEN_INVALID });
  }
};

const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://https://www.wtwrkproject.jumpingcrab.com"
    : "http://localhost:3001";
