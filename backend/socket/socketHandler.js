const onlineUsers = {};

function socketHandler(io) {
  io.on("connection", (socket) => {
    console.log(`User Connected with id: ${socket.id}`);

    socket.on("join", (userId) => {
      onlineUsers[userId] = socket.id;

      console.log(`${userId} joined`);

      console.log(onlineUsers);
    });

    socket.on("disconnect", () => {
      for (const userId in onlineUsers) {
        if (onlineUsers[userId] === socket.id) {
          delete onlineUsers[userId];
          break;
        }
      }

      console.log(onlineUsers);
    });
  });
}

module.exports = socketHandler;
