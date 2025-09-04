const router = require("express").Router();
const {
  updateUserProfile,
  getCurrentUser,
  getUser,
  getUsers,
} = require("../controllers/users");
const {
  validateUserUpdate,
  validateItemId,
} = require("../middlewares/validation");

router.get("/", getUsers);
router.get("/me", getCurrentUser);
router.patch("/me", validateUserUpdate, updateUserProfile);

router.get("/:itemId", validateItemId, getUser);

module.exports = router;
