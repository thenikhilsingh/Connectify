const Comment = require("../models/comment");
const Friend = require("../models/friend");
const Post = require("../models/post");
const { uploadOnCloudinary, cloudinary } = require("../utils/cloudinary");

const createPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const userId = req.user._id;

    let fileData = {};
    if (req.file) {
      const uploaded = await uploadOnCloudinary(req.file.path);
      if (!uploaded) {
        return res.status(500).json({
          message: "File upload failed",
        });
      }
      fileData = {
        url: uploaded.secure_url,
        public_id: uploaded.public_id,
        originalName: req.file.originalname,
        type: req.file.mimetype,
      };
    }
    const post = await Post.create({
      caption: caption,
      file: fileData,
      createdBy: userId,
    });
    return res.status(201).json({ message: "post created successfully", post });
  } catch (error) {
    res.status(400).json({ message: "post creation failed", error });
  }
};

const getPostsOfOnlineUser = async (req, res) => {
  try {
    const post = await Post.find({ createdBy: req.user._id })
      .populate("createdBy", "firstName lastName profilePicture")
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "firstName lastName profilePicture",
        },
      });

    return res.status(200).json({ message: "post loaded successfully", post });
  } catch (error) {
    res.status(400).json({ message: "post load failed", error });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const post = await Post.find({
      createdBy: { $ne: req.user._id },
    })
      .populate("createdBy", "firstName lastName profilePicture")
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "firstName lastName profilePicture",
        },
      });
    return res.status(200).json({ message: "post loaded successfully", post });
  } catch (error) {
    res.status(400).json({ message: "post load failed", error });
  }
};

const getFeedPosts = async (req, res) => {
  try {
    const isFriend = await Friend.find({
      $or: [{ sender: req.user._id }, { reciever: req.user._id }],
      status: "accepted",
    });

    const friendIds = isFriend.map((friend) =>
      friend.sender.equals(req.user._id) ? friend.reciever : friend.sender,
    );

    // Include your own posts
    friendIds.push(req.user._id);

    const post = await Post.find({
      createdBy: { $in: friendIds },
    })
      .populate("createdBy", "firstName lastName profilePicture")
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "firstName lastName profilePicture",
        },
      });

    return res.status(200).json({ message: "post loaded successfully", post });
  } catch (error) {
    res.status(400).json({ message: "post load failed", error });
  }
};

const writeComment = async (req, res) => {
  try {
    const { postId, text } = req.body;
    const author = req.user._id;

    const doComment = await Comment.create({
      post: postId,
      text: text,
      author: author,
    });
    await Post.findByIdAndUpdate(postId, {
      $push: {
        comments: doComment._id,
      },
    });
    return res
      .status(201)
      .json({ message: "comment done successfully", doComment });
  } catch (error) {
    res.status(400).json({ message: "comment  failed", error });
  }
};

const doLike = async (req, res) => {
  try {
    const { postId } = req.body;
    const post = await Post.findOne({ _id: postId });

    const alreadyLiked = post.likes.some((id) => id.equals(req.user._id));

    if (alreadyLiked) {
      post.likes.pull(req.user._id);
    } else {
      post.likes.push(req.user._id);
    }
    await post.save();
    return res.status(200).json({ message: "like done successfully" });
  } catch (error) {
    res.status(400).json({ message: "like  failed", error });
  }
};

const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({ message: "post not found", error });
    }

    const deletedPost = await Post.findOneAndDelete({
      _id: postId,
      createdBy: req.user._id,
    });
    if (!deletedPost) {
      return res.status(403).json({
        message: "You are not authorized to delete this post",
      });
    }
    if (post.file.public_id) {
      await cloudinary.uploader.destroy(post.file.public_id);
    }
    await Comment.deleteMany({
      _id: {
        $in: post.comments,
      },
    });
    return res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    res.status(400).json({ message: "Post deletion  failed", error });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }
    if (!comment.author.equals(req.user._id)) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }
    await Comment.findByIdAndDelete(commentId);
    await Post.findByIdAndUpdate(comment.post, {
      $pull: {
        comments: commentId,
      },
    });
    return res.status(200).json({
      message: "Comment deleted successfully",
    });
  } catch (error) {
    res.status(400).json({ message: "Comment deletion  failed", error });
  }
};

module.exports = {
  createPost,
  getPostsOfOnlineUser,
  getAllPosts,
  getFeedPosts,
  writeComment,
  doLike,
  deletePost,
  deleteComment,
};
