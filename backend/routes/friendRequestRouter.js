const Router = require("express");
const {
  getPeople,
  sendFriendRequest,
  getRequestInfo,
  requestNotifications,
  acceptOrDeniedRequest,
} = require("../controllers/friendRequestController");
const authMiddleware = require("../middlewares/authMiddleware");

const friendRequestRouter = Router();

friendRequestRouter.get("/", authMiddleware, getPeople);
friendRequestRouter.post(
  "/sendFriendRequest/:id",
  authMiddleware,
  sendFriendRequest,
);

friendRequestRouter.get("/getRequestInfo", authMiddleware, getRequestInfo);
friendRequestRouter.get(
  "/requestNotifications",
  authMiddleware,
  requestNotifications,
);
friendRequestRouter.put(
  "/acceptOrDeniedRequest/:id",
  authMiddleware,
  acceptOrDeniedRequest,
);

module.exports = friendRequestRouter;
