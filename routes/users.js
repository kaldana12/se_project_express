const router = require("express").Router();
const {
  updateUserProfile,
  getCurrentUser,
  getUser,
  getUsers,
} = require("../controllers/users");
const { validateUserUpdate } = require("../middlewares/validation");


router.get("/", getUsers);
router.get("/:userId", validateId, getUser);


router.patch("/me", validateUserUpdate, updateUserProfile);
router.get("/me", getCurrentUser);



module.exports = router;
