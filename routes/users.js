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
const auth = require("../middlewares/auth");

router.get("/", getUsers);
router.post("/", validateLogin, login);
router.get("/me", auth, getCurrentUser);
router.patch("/me", validateUserUpdate, updateUserProfile);

router.get("/:itemId", validateItemId, getUser);

module.exports = router;
