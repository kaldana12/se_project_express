const router = require("express").Router();
const userRouter = require("./users");
const clothingItem = require("./clothingItem");

const { STATUS_CODES } = require("../utils/constants");

router.use("/users", userRouter);
router.use("/items", clothingItem);

router.use((req, res) => {
  res.status(STATUS_CODES.NOT_FOUND).send({ message: "Route not found" });
});

module.exports = router;
