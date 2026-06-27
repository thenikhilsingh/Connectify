const Router = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { getFriends } = require("../controllers/friendsController");

const friendsRouter = Router();

friendsRouter.get("/", authMiddleware, getFriends);

module.exports = friendsRouter;
