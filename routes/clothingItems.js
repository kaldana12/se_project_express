const router = require("express").Router();

const auth = require("../middlewares/auth");
const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

const {
  validateCardBody,
  validateItemId,
} = require("../middlewares/validation");

// Create item (requires body validation)
router.post("/", auth, validateCardBody, createItem);

// Get all items (no validation needed)
router.get("/", getItems);

// Like item (validate :itemId param)
router.put("/:itemId/likes", auth, validateItemId, likeItem);

// Dislike item (validate :itemId param)
router.delete("/:itemId/likes", auth, validateItemId, dislikeItem);

// Delete item by ID (validate :itemId param)
router.delete("/:itemId", auth, validateItemId, deleteItem);

module.exports = router;
