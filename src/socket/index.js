const socketio = require("socket.io");
const { addUserSocketToRoom } = require("./databaseInteractions");

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

        socket.broadcast.to(data.roomId).emit("CHAT_MESSAGE", onlineMessage);
      } catch (error) {
        console.log(error);
      }
    });
  });
};

module.exports = createSocketServer;
