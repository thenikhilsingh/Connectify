const Router = require("express");
const {
  getPeople,
  sendFriendRequest,
  getRequestInfo,
  requestNotifications,
} = require("../controllers/friendRequestController");
const authMiddleware = require("../middlewares/authMiddleware");

const friendRequestRouter = Router();

friendRequestRouter.get("/", authMiddleware, getPeople);
friendRequestRouter.post(
  "/sendFriendRequest/:id",
  authMiddleware,
  sendFriendRequest,
);

friendRequestRouter.get("/getRequestInfo/:id", authMiddleware, getRequestInfo);
friendRequestRouter.get("/requestNotifications", authMiddleware, requestNotifications);

module.exports = friendRequestRouter;
