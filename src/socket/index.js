const socketio = require("socket.io");
const {
  addUserSocketToRoom,
  getUsersInRoom,
  removeUserSocketFromRoom,
} = require("./databaseInteractions");

const createSocketServer = (server) => {
  const io = socketio(server);

  io.on("connection", (socket) => {
    console.log("new connection:", socket.id);

    socket.on("JOIN_ROOM", async (data) => {
      try {
        socket.join(data.roomId);

        await addUserSocketToRoom(data, socket.id);

        const onlineMessage = {
          sender: "Corporate God: Jeff Bazos",
          text: `${data.username} is now online`,
          createdAt: new Date(),
        };

        socket.to(data.roomId).broadcast.emit("CHAT_MESSAGE", onlineMessage);

        const userList = await getUsersInRoom(data.roomId);
        io.to(data.roomId).emit("roomData", {
          room: data.roomId,
          list: userList,
        });
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("drawing", (data) =>
      socket.to(data.roomId).broadcast.emit("drawing", data)
    );

    socket.on("LEAVE_ROOM", async (data) => {
      try {
        socket.leave(data.roomId);

        await removeUserSocketFromRoom(data, socket.id);

        const offlineMessage = {
          sender: "Corporate God: Jeff Bazos",
          text: `${data.username} is now offline`,
          createdAt: new Date(),
        };

        socket.to(data.roomId).broadcast.emit("CHAT_MESSAGE", offlineMessage);

        const userList = await getUsersInRoom(data.roomId);
        io.to(data.roomId).emit("roomData", {
          room: data.roomId,
          list: userList,
        });
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("CHAT_MESSAGE", (data) =>
      socket.to(data.roomId).emit("CHAT_MESSAGE", data)
    );
  });
};

module.exports = createSocketServer;
