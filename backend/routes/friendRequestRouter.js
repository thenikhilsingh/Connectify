const Router = require("express");
const {
  getPeople,
  sendFriendRequest,
} = require("../controllers/friendRequestController");
const authMiddleware = require("../middlewares/authMiddleware");

const friendRequestRouter = Router();

friendRequestRouter.get("/", authMiddleware, getPeople);
friendRequestRouter.post(
  "/sendFriendRequest/:id",
  authMiddleware,
  sendFriendRequest,
);

module.exports = friendRequestRouter;
