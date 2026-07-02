const Router = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  createGroup,
  getGroups,
  getGroupMessages,
} = require("../controllers/groupController");
const upload = require("../middlewares/multerMiddleware");

const groupRouter = Router();

groupRouter.post(
  "/",
  authMiddleware,
  upload.single("groupPicture"),
  createGroup,
);
groupRouter.get("/", authMiddleware, getGroups);
groupRouter.get("/messages/:groupId", authMiddleware, getGroupMessages);

module.exports = groupRouter;
