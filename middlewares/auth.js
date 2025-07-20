const jwt = require("jsonwebtoken");
const { JWT_SECRET = "dev-secret" } = process.env;
const { UnauthorizedError } = require("../utils/errors"); // Create this if you don't have it

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Authorization required"));
  }

  const token = authorization.replace("Bearer ", "");

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new UnauthorizedError("Invalid token"));
  }

  req.user = payload; // Attach user payload to request
  next(); // Proceed to the next middleware or route handler
};
