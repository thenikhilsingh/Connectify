const Router = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { getMessagesApi } = require("../controllers/messagesController");

const messagesRouter = Router();

messagesRouter.get("/:friendId", authMiddleware, getMessagesApi);

module.exports = messagesRouter;
