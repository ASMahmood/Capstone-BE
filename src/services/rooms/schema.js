const { Schema, model } = require("mongoose");

const RoomSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  participants: [{ type: Schema.Types.ObjectId, ref: "Users" }],
  chatHistory: [{ type: Schema.Types.ObjectId, ref: "Messages" }],
  images: [
    {
      canvasData: { type: String },
      sender: { type: Schema.Types.ObjectId, ref: "Users" },
    },
  ],
});

RoomSchema.statics.addUserToRoom = async function (userId, roomId) {
  try {
    const updatedRoom = await this.findByIdAndUpdate(roomId, {
      $addToSet: { participants: userId },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = model("room", RoomSchema);
