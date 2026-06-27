const Friend = require("../models/friend");
const User = require("../models/user");

const getPeople = async (req, res) => {
  try {
    const people = await User.find();
    res.status(200).json({ success: true, people });
  } catch (error) {
    res.status(400).json({ success: false, message: error });
  }
};

const sendFriendRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const senderId = req.user._id;

    const requestSent = await Friend.create({
      sender: senderId,
      reciever: id,
    });
    res.status(200).json({
      success: true,
      message: "friend request sent successfully!",
      requestSent,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getRequestInfo = async (req, res) => {
  try {
    const userId = req.user._id;

    const requestDetail = await Friend.find({
      $or: [{ sender: userId }, { reciever: userId }],
    })
      .populate("sender")
      .populate("reciever");

    const data = requestDetail.map((request) => {
      return {
        ...request.toObject(),
        role: request.sender._id.equals(userId) ? "sender" : "reciever",
      };
    });

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const requestNotifications = async (req, res) => {
  try {
    const notifications = await Friend.find({
      reciever: req.user._id,
      status: "pending",
    }).populate("sender");

    res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const acceptOrDeniedRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const update = await Friend.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );
    res.status(200).json({
      success: true,
      update,
      message: `request ${status}`,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getPeople,
  sendFriendRequest,
  getRequestInfo,
  requestNotifications,
  acceptOrDeniedRequest,
};
