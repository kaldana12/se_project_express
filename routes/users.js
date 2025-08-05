const router = require("express").Router();
const auth = require("../middlewares/auth");
const { updateUserProfile, getCurrentUser } = require("../controllers/users");

router.patch("/me", updateUserProfile);
router.get("/me", getCurrentUser);

module.exports = router;
