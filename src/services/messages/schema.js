const { Schema, model } = require("mongoose");

const MessageSchema = new Schema(
  {
    message: {
      type: String,
      required: true,
    },
    sender: { type: Schema.Types.ObjectId, ref: "Users" },
    room: { type: Schema.Types.ObjectId, ref: "Rooms" },
  },
  { timestamps: true }
);

module.exports = model("message", MessageSchema);
