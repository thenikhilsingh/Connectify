const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const indexRouter = require("./routes/indexRouter");
const authRouter = require("./routes/authRouter");
const cors = require("cors");
const friendRequestRouter = require("./routes/friendRequestRouter");
const profileRouter = require("./routes/profileRouter");
const friendsRouter = require("./routes/friendsRouter");
const { createServer } = require("http");
const initSocket = require("./socket/socket");
const socketHandler = require("./socket/socketHandler");
const messagesRouter = require("./routes/messagesRouter");
dotenv.config();

const app = express();
const server = createServer(app);
const io = initSocket(server);

socketHandler(io);

app.use(
  cors({
    origin: [process.env.CLIENT_URL],
    credentials: true,
  }),
);
app.use(express.json());
app.use("/api/health", indexRouter);
app.use("/api/auth", authRouter);
app.use("/api/people", friendRequestRouter);
app.use("/api/profile", profileRouter);
app.use("/api/friends", friendsRouter);
app.use("/api/messages", messagesRouter);

const PORT = process.env.PORT;
connectDB().then(() => {
  // app.listen(PORT, () => {
  server.listen(PORT, () => {
    console.log(`the server is listening on http://localhost:${PORT}/`);
  });
});
