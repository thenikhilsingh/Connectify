const { Server } = require("socket.io");

function initSocket(server) {
  return new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });
}

module.exports = initSocket;
