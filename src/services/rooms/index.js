const express = require("express");
const {
  authenticateUser,
  authorizeUser,
} = require("../../utilities/authTools");
const RoomModel = require("./schema");
const UserModel = require("../users/schema");
const roomRouter = express.Router();

//CREATE ROOM
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

//GET ALL ROOMS
roomRouter.get("/", authorizeUser, async (req, res, next) => {
  try {
    const allRooms = await RoomModel.find();
    res.send(allRooms);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//GET ROOM BY ID
roomRouter.get("/:id", authorizeUser, async (req, res, next) => {
  try {
    const singleRoom = await RoomModel.findById(req.params.id);
    if (singleRoom) {
      res.send(singleRoom);
    } else {
      res.status(404).send({ message: "Could not find a room with this id" });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//ADD USER TO ROOM AND VIS-VERSA
roomRouter.put(
  "/:roomId/add-user/:userId",
  authorizeUser,
  async (req, res, next) => {
    console.log(req.user._id);
    console.log(req.params.userId);
    try {
      if (req.user._id.toString() === req.params.userId) {
        res.send("authorized");
        await RoomModel.addUserToRoom(req.params.userId, req.params.roomId);
        await UserModel.addRoomToUser(req.params.userId, req.params.roomId);
      } else {
        res.status(401).send({ message: "This is not your account!" });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

module.exports = roomRouter;
