const router = require("express").Router();

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
// CRUD

// Create
router.post("/", createItem);

// read
router.get("/", getItems);

// delete
router.delete("/:itemId", deleteItem);

// like
router.put("/:itemId/likes", likeItem);

// dislike
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
