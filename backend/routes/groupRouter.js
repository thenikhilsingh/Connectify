const Router = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  createGroup,
  getGroups,
  getGroupMessages,
  uploadGroupFile,
  getGroupSharedFiles,
  addMember,
  removeMember,
  leaveGroup,
  deleteGroup,
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
groupRouter.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  uploadGroupFile,
);
groupRouter.get("/shared/:groupId", authMiddleware, getGroupSharedFiles);
groupRouter.patch("/add-member", authMiddleware, addMember);
groupRouter.patch("/remove-member", authMiddleware, removeMember);
groupRouter.patch("/leave", authMiddleware, leaveGroup);
groupRouter.delete("/:groupId", authMiddleware, deleteGroup);

module.exports = groupRouter;
