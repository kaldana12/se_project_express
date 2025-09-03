const router = require("express").Router();
const userRouter = require("./users");
const clothingItem = require("./clothingItems");
const { login, createUser } = require("../controllers/users");
const {
  validateLogin,
  validateUserCreation,
} = require("../middlewares/validation");
const auth = require("../middlewares/auth");
const { NotFoundError } = require("../utils/errors");

// Public routes
router.post("/signin", validateLogin, login);
router.post("/signup", validateUserCreation, createUser);
router.use("/items", clothingItem);

router.use(auth);

// Protected routes
router.use("/users", userRouter);

// Catch-all for unknown routes
router.use((req, res, next) => {
  next(new NotFoundError("Route not found"));
});

module.exports = router;
