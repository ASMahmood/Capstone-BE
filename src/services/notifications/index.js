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
notificationRouter.get("/:userId", authorizeUser, async (req, res, next) => {
  try {
    const userNotifications = await NotificationModel.find({
      user: req.params.userId,
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

module.exports = notificationRouter;
