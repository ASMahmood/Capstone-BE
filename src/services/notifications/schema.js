const { Schema, model } = require("mongoose");

const NotificationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["friend", "room", "chat", "draw"],
      default: "friend",
    },
    room: {
      type: Schema.Types.ObjectId,
      ref: "Rooms",
      required: false,
    },
    senderUser: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: false,
    },
    seen: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("notification", NotificationSchema);
