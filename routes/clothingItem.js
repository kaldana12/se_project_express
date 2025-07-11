const router = require("express").Router();

const {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItem");
//CRUD

//Create
router.post("/", createItem);

//read
router.get("/", getItems);

//Update
router.put("/:itemId", updateItem);

//delete
router.delete("/:itemId", deleteItem);

//like
router.put("/:itemId/likes", likeItem);

//dislike
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
