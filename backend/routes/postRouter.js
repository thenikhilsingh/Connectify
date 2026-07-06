const Router = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/multerMiddleware");
const {
  createPost,
  getPostsOfOnlineUser,
  getAllPosts,
  getFeedPosts,
  writeComment,
  doLike,
  deletePost,
  deleteComment,
} = require("../controllers/postController");

const postRouter = Router();

postRouter.post("/create", authMiddleware, upload.single("media"), createPost);
postRouter.get("/user", authMiddleware, getPostsOfOnlineUser);
postRouter.get("/", authMiddleware, getAllPosts);
postRouter.get("/feed", authMiddleware, getFeedPosts);
postRouter.post("/comment", authMiddleware, writeComment);
postRouter.patch("/like", authMiddleware, doLike);
postRouter.delete("/delete/:postId", authMiddleware, deletePost);
postRouter.delete("/comment/delete/:commentId", authMiddleware, deleteComment);

module.exports = postRouter;
