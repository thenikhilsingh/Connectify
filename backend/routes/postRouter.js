const Router = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/multerMiddleware");
const {
  createPost,
  getPostsOfOnlineUser,
} = require("../controllers/postController");

const postRouter = Router();

postRouter.post("/create", authMiddleware, upload.single("media"), createPost);
postRouter.get("/user", authMiddleware, getPostsOfOnlineUser);

module.exports = postRouter;
