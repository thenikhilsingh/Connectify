const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const indexRouter = require("./routes/indexRouter");
const authRouter = require("./routes/authRouter");
const cors = require("cors");
const friendRequestRouter = require("./routes/friendRequestRouter");
const profileRouter = require("./routes/profileRouter");
const friendsRouter = require("./routes/friendsRouter");
dotenv.config();

const app = express();

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

const PORT = process.env.PORT;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`the server is listening on http://localhost:${PORT}/`);
  });
});
