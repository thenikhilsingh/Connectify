const Message = require("../models/message");
const { uploadOnCloudinary } = require("../utils/cloudinary");

const saveMessage = async ({ sender, reciever, text }) => {
  try {
    const newMessage = await Message.create({
      sender,
      reciever,
      text,
    });
    return newMessage;
  } catch (error) {
    throw error;
  }
};

const getMessages = async (userId, friendId) => {
  try {
    const messages = await Message.find({
      $or: [
        {
          sender: userId,
          reciever: friendId,
        },
        {
          sender: friendId,
          reciever: userId,
        },
      ],
    }).sort({ createdAt: 1 }); //Because chats should appear from oldest tp newest.

    return messages;
  } catch (error) {
    throw error;
  }
};

const getMessagesApi = async (req, res) => {
  try {
    const userId = req.user._id;
    const friendId = req.params.friendId;

    const messages = await getMessages(userId, friendId);

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const uploadMessageFile = async (req, res) => {
  try {
    const sender = req.user._id;
    const reciever = req.body.reciever;
    const text = req.body.text || "";

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select a file",
      });
    }

    const uploadedFile = await uploadOnCloudinary(req.file.path);

    const newMessage = await Message.create({
      sender,
      reciever,
      text,
      file: {
        url: uploadedFile.secure_url,
        public_id: uploadedFile.public_id,
        originalName: req.file.originalname,
        type: req.file.mimetype,
      },
    });

    res.status(201).json({
      success: true,
      message: "File uploaded successfully",
      newMessage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSharedFiles = async (req, res) => {
  try {
    const userId = req.user._id;
    const friendId = req.params.friendId;

    const messages = await Message.find({
      $or: [
        { sender: userId, reciever: friendId },
        { sender: friendId, reciever: userId },
      ],
      "file.url": { $ne: "" },
    });

    const media = messages.filter((msg) => msg.file?.type?.startsWith("image"));

    const files = messages.filter(
      (msg) => msg.file?.url && !msg.file.type.startsWith("image"),
    );

    res.json({
      success: true,
      media,
      files,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  saveMessage,
  getMessages,
  getMessagesApi,
  uploadMessageFile,
  getSharedFiles,
};
