const Router = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/multerMiddleware");
const { createPost } = require("../controllers/postController");

const postRouter = Router();

postRouter.post("/create", authMiddleware, upload.single("media"), createPost);

module.exports = postRouter;
