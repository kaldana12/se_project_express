const router = require("express").Router();
const userRouter = require("./users");
const clothingItem = require("./clothingItems");
const { login, createUser } = require("../controllers/users");
const { STATUS_CODES } = require("../utils/constants");
const auth = require("../middlewares/auth");

// Public routes
router.post("/signin", login);
router.post("/signup", createUser);
router.use("/items", clothingItem);

router.use(auth);

// Protected routes
router.use("/users", userRouter);

// Catch-all for unknown routes
router.use((req, res) => {
  res.status(STATUS_CODES.NOT_FOUND).send({ message: "Route not found" });
});

module.exports = router;
