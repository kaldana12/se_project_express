const router = require("express").Router();
const { getUsers, createUsers, getUser } = require("../controllers/users");

router.get("/", getUsers);
router.get("/:userId", getUser);
router.post("/", createUsers);

module.exports = router;
