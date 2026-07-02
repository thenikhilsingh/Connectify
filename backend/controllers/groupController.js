const Group = require("../models/group");
const GroupMessage = require("../models/groupMessage");
const { uploadOnCloudinary } = require("../utils/cloudinary");

const createGroup = async (req, res) => {
  try {
    const name = req.body.name;

    const members = Array.isArray(req.body.members)
      ? req.body.members
      : [req.body.members];
    let groupPicture = {
      url: "",
      public_id: "",
    };

    if (req.file) {
      const uploaded = await uploadOnCloudinary(req.file.path);

      groupPicture = {
        url: uploaded.secure_url,
        public_id: uploaded.public_id,
      };
    }

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Group name is required",
      });
    }

    if (!members || members.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Group must have at least 3 members including you",
      });
    }

    const group = await Group.create({
      name,
      members: [...members, req.user._id],
      admin: req.user._id,
      groupPicture,
    });

    res.status(201).json({
      success: true,
      message: "Group created successfully",
      group,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getGroups = async (req, res) => {
  try {
    const groups = await Group.find({
      members: req.user._id,
    })
      .populate("admin", "firstName lastName profilePicture")
      .populate("members", "firstName lastName profilePicture");

    res.status(200).json({
      success: true,
      groups,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;

    const messages = await GroupMessage.find({
      group: groupId,
    })
      .populate("sender", "firstName lastName profilePicture")
      .sort({
        createdAt: 1,
      });

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

const saveGroupMessage = async ({ group, sender, text }) => {
  try {
    const message = await GroupMessage.create({
      group,
      sender,
      text,
    });

    const populatedMessage = await GroupMessage.findById(message._id).populate(
      "sender",
      "firstName lastName profilePicture",
    );

    return populatedMessage;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createGroup,
  getGroups,
  getGroupMessages,
  saveGroupMessage,
};
