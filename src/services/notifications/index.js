const express = require("express");
const { authorizeUser } = require("../../utilities/authTools");
const NotificationModel = require("./schema");

const notificationRouter = expresss.Router();

//CREATE NOTIFICATION
notificationRouter.post("/", authorizeUser, async (req, res, next) => {
  try {
    const newNotification = await new NotificationModel(req.body);
    const { _id } = await newNotification.save();
    res.status(201).send({ message: _id });
  } catch {
    console.log(error);
    next(error);
  }
});

//GET NOTIFICATIONS OF SINGLE USER
notificationRouter.get("/", authorizeUser, async (req, res, next) => {
  try {
    const userNotifications = await NotificationModel.find({
      user: req.user._id,
    });
    if (userNotifications.length > 0) {
      res.send(userNotifications);
    } else {
      res.status(404).send({ message: "This user has no notifications!" });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//UPDATE NOTIFICATION AS SEEN
notificationRouter.put(
  "/:notificationId",
  authorizeUser,
  async (req, res, next) => {
    try {
      const notification = await UserModel.findById(req.params.notificationId);
      if (req.user._id === notification.user) {
        const editedNotification = await UserModel.findByIdAndUpdate(
          req.user._id,
          req.body,
          { runValidators: true, new: true }
        ).populate("rooms");
        res.send(editedNotification);
      } else {
        res.status(401).send({ message: "This is not your account" });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

module.exports = notificationRouter;
