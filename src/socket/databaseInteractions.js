const MessageModel = require("../services/messages/schema");
const RoomModel = require("../services/rooms/schema");
const UserModel = require("../services/users/schema");

const addUserSocketToRoom = async (data, socketId) => {
  try {
    await RoomModel.findOneAndUpdate(
      {
        _id: data.roomId,
        "participants.user": data.userId,
      },
      { "participants.$.socketId": socketId }
    );
  } catch (error) {
    console.log(error);
  }
};

const getUsersInRoom = async () => {
  try {
  } catch (error) {
    console.log(error);
  }
};

module.exports = { addUserSocketToRoom };
