const ClothingItem = require("../models/clothingItem");
const { STATUS_CODES, ERROR_MESSAGES } = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.status(STATUS_CODES.CREATED).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .send({ message: ERROR_MESSAGES.INVALID_DATA });
      }
      return res
        .status(STATUS_CODES.SERVER_ERROR)
        .send({ message: ERROR_MESSAGES.SERVER_ERROR });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(STATUS_CODES.OK).send(items))
    .catch(() => {
      res
        .status(STATUS_CODES.SERVER_ERROR)
        .send({ message: ERROR_MESSAGES.SERVER_ERROR });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== req.user._id) {
        return res
          .status(STATUS_CODES.FORBIDDEN)
          .send({ message: ERROR_MESSAGES.NO_PERMISSION });
      }

      return item.deleteOne().then(() => {
        res.status(STATUS_CODES.OK).send({ message: "Item deleted" });
      });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .send({ message: ERROR_MESSAGES.INVALID_ID });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .send({ message: ERROR_MESSAGES.ITEM_NOT_FOUND });
      }
      return res
        .status(STATUS_CODES.SERVER_ERROR)
        .send({ message: ERROR_MESSAGES.SERVER_ERROR });
    });
};

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .send({ message: ERROR_MESSAGES.ITEM_NOT_FOUND });
      }
      return res.status(STATUS_CODES.OK).send(item);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .send({ message: ERROR_MESSAGES.INVALID_ID });
      }
      return res
        .status(STATUS_CODES.SERVER_ERROR)
        .send({ message: ERROR_MESSAGES.SERVER_ERROR });
    });
};

const dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .send({ message: ERROR_MESSAGES.ITEM_NOT_FOUND });
      }
      return res.status(STATUS_CODES.OK).send(item);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(STATUS_CODES.BAD_REQUEST)
          .send({ message: ERROR_MESSAGES.INVALID_ID });
      }
      return res
        .status(STATUS_CODES.SERVER_ERROR)
        .send({ message: ERROR_MESSAGES.SERVER_ERROR });
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
