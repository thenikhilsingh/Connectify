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

const uploadGroupFile = async (req, res) => {
  try {
    const sender = req.user._id;
    const group = req.body.group;
    const text = req.body.text || "";

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select a file",
      });
    }

    const uploadedFile = await uploadOnCloudinary(req.file.path);

    const newMessage = await GroupMessage.create({
      sender,
      group,
      text,
      file: {
        url: uploadedFile.secure_url,
        public_id: uploadedFile.public_id,
        originalName: req.file.originalname,
        type: req.file.mimetype,
      },
    });

    const populatedMessage = await GroupMessage.findById(
      newMessage._id,
    ).populate("sender", "firstName lastName profilePicture");

    res.status(201).json({
      success: true,
      message: "Group file uploaded successfully",
      newMessage: populatedMessage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getGroupSharedFiles = async (req, res) => {
  try {
    const { groupId } = req.params;

    const messages = await GroupMessage.find({
      group: groupId,
      "file.url": { $ne: "" },
    }).sort({ createdAt: -1 });

    const media = messages.filter((msg) => msg.file.type.startsWith("image"));

    const files = messages.filter((msg) => !msg.file.type.startsWith("image"));

    res.status(200).json({
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

const addMember = async (req, res) => {
  try {
    const { groupId, memberId } = req.body;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    // Only admin can add members
    if (group.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only admin can add members",
      });
    }

    // Already a member?
    if (group.members.includes(memberId)) {
      return res.status(400).json({
        success: false,
        message: "User is already a member",
      });
    }

    group.members.push(memberId);

    await group.save();

    await group.populate("members", "firstName lastName profilePicture");

    res.status(200).json({
      success: true,
      message: "Member added successfully",
      group,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const removeMember = async (req, res) => {
  try {
    const { groupId, memberId } = req.body;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    // Only admin can remove members
    if (group.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only admin can remove members",
      });
    }

    // Prevent removing the admin
    if (group.admin.toString() === memberId) {
      return res.status(400).json({
        success: false,
        message: "Admin cannot be removed",
      });
    }

    group.members = group.members.filter(
      (member) => member.toString() !== memberId,
    );

    await group.save();

    await group.populate("members", "firstName lastName profilePicture");

    res.status(200).json({
      success: true,
      message: "Member removed successfully",
      group,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const leaveGroup = async (req, res) => {
  try {
    const { groupId } = req.body;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    // Admin cannot leave
    if (group.admin.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "Admin cannot leave the group. Delete it instead.",
      });
    }

    group.members = group.members.filter(
      (member) => member.toString() !== req.user._id.toString(),
    );

    await group.save();

    res.status(200).json({
      success: true,
      message: "Left group successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteGroup = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    if (group.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only admin can delete group",
      });
    }

    await GroupMessage.deleteMany({
      group: groupId,
    });

    await Group.findByIdAndDelete(groupId);

    res.status(200).json({
      success: true,
      message: "Group deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createGroup,
  getGroups,
  getGroupMessages,
  saveGroupMessage,
  uploadGroupFile,
  getGroupSharedFiles,
  addMember,
  removeMember,
  leaveGroup,
  deleteGroup,
};
