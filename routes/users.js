const router = require("express").Router();
const { login, getCurrentUser } = require("../controllers/users");

router.post("/login", login);
router.get("/me", getCurrentUser);

module.exports = router;
