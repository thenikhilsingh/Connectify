const Router = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/multerMiddleware");
const {
  createPost,
  getPostsOfOnlineUser,
  getAllPosts,
  getFeedPosts,
} = require("../controllers/postController");

const postRouter = Router();

postRouter.post("/create", authMiddleware, upload.single("media"), createPost);
postRouter.get("/user", authMiddleware, getPostsOfOnlineUser);
postRouter.get("/", authMiddleware, getAllPosts);
postRouter.get("/feed", authMiddleware, getFeedPosts);

module.exports = postRouter;
