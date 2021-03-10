const { Schema, model } = require("mongoose");

const RoomSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  participants: [{ type: Schema.Types.ObjectId, ref: "Users" }],
  chatHistory: [
    {
      message: { type: String, required: true },
      sender: { type: Schema.Types.ObjectId, ref: "Users" },
      date: new Date(),
    },
  ],
  images: [
    {
      canvasData: { type: String },
      sender: { type: Schema.Types.ObjectId, ref: "Users" },
    },
  ],
});

module.exports = model("room", RoomSchema);
