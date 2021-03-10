const express = require("express");
const {
  authenticateUser,
  authorizeUser,
} = require("../../utilities/authTools");
const RoomModel = require("./schema");
const roomRouter = express.Router();

roomRouter.post("/", authorizeUser, async (req, res, next) => {
  try {
    const newRoom = await new RoomModel(req.body);
    const { _id } = await newRoom.save();
    res.status(201).send(_id);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = roomRouter;
