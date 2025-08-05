const router = require("express").Router();

const auth = require("../middlewares/auth");

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
// CRUD

// Create
router.post("/", auth, createItem);

// read
router.get("/", auth, getItems);

// delete
router.delete("/:itemId", auth, deleteItem);

// like
router.put("/:itemId/likes", auth, likeItem);

// dislike
router.delete("/:itemId/likes", auth, dislikeItem);

module.exports = router;
