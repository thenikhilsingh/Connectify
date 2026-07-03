const { saveMessage } = require("../controllers/messagesController");
const { saveGroupMessage } = require("../controllers/groupController");

const onlineUsers = {};

function socketHandler(io) {
  io.on("connection", (socket) => {
    console.log(`User Connected with id: ${socket.id}`);

    socket.on("join", (userId) => {
      onlineUsers[userId] = socket.id;
      io.emit("onlineUsers", Object.keys(onlineUsers));
      console.log(`${userId} joined`);

      console.log(onlineUsers);
    });

    socket.on("sendMessage", async (data) => {
      try {
        const savedMessage = await saveMessage(data);
        console.log(savedMessage);
        socket.emit("messageSent", savedMessage);
        const receiverSocket = onlineUsers[data.reciever];
        console.log(receiverSocket);
        if (receiverSocket) {
          io.to(receiverSocket).emit("receiveMessage", savedMessage);
        }
        console.log("Data:", data);
        console.log("Online Users:", onlineUsers);
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("typing", ({ sender, reciever }) => {
      const receiverSocket = onlineUsers[reciever];

      if (receiverSocket) {
        io.to(receiverSocket).emit("typing", sender);
      }
    });

    socket.on("stopTyping", ({ sender, reciever }) => {
      const receiverSocket = onlineUsers[reciever];

      if (receiverSocket) {
        io.to(receiverSocket).emit("stopTyping", sender);
      }
    });

    socket.on("joinGroup", (groupId) => {
      socket.join(groupId);

      console.log(`Joined group ${groupId}`);
    });

    socket.on("sendGroupMessage", async (data) => {
      try {
        const savedMessage = await saveGroupMessage(data);

        io.to(data.group).emit("receiveGroupMessage", savedMessage);
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("sendGroupFile", (message) => {
      io.to(message.group.toString()).emit("receiveGroupMessage", message);
    });

    socket.on("disconnect", () => {
      for (const userId in onlineUsers) {
        if (onlineUsers[userId] === socket.id) {
          delete onlineUsers[userId];
          break;
        }
      }
      io.emit("onlineUsers", Object.keys(onlineUsers));
      console.log(onlineUsers);
    });
  });
}

module.exports = socketHandler;
