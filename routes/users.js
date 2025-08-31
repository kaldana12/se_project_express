const router = require("express").Router();
const { updateUserProfile, getCurrentUser } = require("../controllers/users");
const { validateUserUpdate } = require("../middlewares/validation");

router.patch("/me", validateUserUpdate, updateUserProfile);
router.get("/me", getCurrentUser);

module.exports = router;
