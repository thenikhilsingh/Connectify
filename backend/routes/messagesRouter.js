const Router = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getMessagesApi,
  uploadMessageFile,
  getSharedFiles,
} = require("../controllers/messagesController");
const upload = require("../middlewares/multerMiddleware");

const messagesRouter = Router();

messagesRouter.get("/:friendId", authMiddleware, getMessagesApi);
messagesRouter.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  uploadMessageFile,
);
messagesRouter.get("/shared/:friendId", authMiddleware, getSharedFiles);

module.exports = messagesRouter;
