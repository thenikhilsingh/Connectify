const Post = require("../models/post");
const { uploadOnCloudinary } = require("../utils/cloudinary");

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
    const post = await Post.find({ createdBy: req.user._id }).populate(
      "createdBy",
      "firstName lastName profilePicture",
    );
    return res.status(200).json({ message: "post loaded successfully", post });
  } catch (error) {
    res.status(400).json({ message: "post load failed", error });
  }
};

module.exports = { createPost, getPostsOfOnlineUser };
