const router = require("express").Router();
const {
  updateUserProfile,
  getCurrentUser,
  getUser,
  getUsers,
} = require("../controllers/users");
const { validateUserUpdate, validateId } = require("../middlewares/validation");

router.get("/", getUsers);
router.get("/me", getCurrentUser);
router.patch("/me", validateUserUpdate, updateUserProfile);

router.get("/:itemId", validateId, getUser);

module.exports = router;
