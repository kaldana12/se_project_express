const ClothingItem = require("../models/clothingItem");
const { STATUS_CODES, ERROR_MESSAGES } = require("../utils/errors");

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(STATUS_CODES.CREATED).send({ data: item }))
    .catch((err) => next(err));
};

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .populate("owner")
    .then((items) => res.status(STATUS_CODES.OK).send(items))
    .catch(next);
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== req.user._id) {
        const err = new Error(ERROR_MESSAGES.NO_PERMISSION);
        err.statusCode = STATUS_CODES.FORBIDDEN;
        throw err;
      }
      return item.deleteOne().then(() => {
        res.status(STATUS_CODES.OK).send({ message: "Item deleted" });
      });
    })
    .catch(next);
};

const likeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        const err = new Error(ERROR_MESSAGES.ITEM_NOT_FOUND);
        err.statusCode = STATUS_CODES.NOT_FOUND;
        throw err;
      }
      res.status(STATUS_CODES.OK).send(item);
    })
    .catch(next);
};

const dislikeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        const err = new Error(ERROR_MESSAGES.ITEM_NOT_FOUND);
        err.statusCode = STATUS_CODES.NOT_FOUND;
        throw err;
      }
      res.status(STATUS_CODES.OK).send(item);
    })
    .catch(next);
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
