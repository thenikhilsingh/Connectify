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
    const { id } = req.params;
    const senderId = req.user._id;
    const requestDetail = await Friend.findOne({
      sender: senderId,
      reciever: id,
    });
    res.status(200).json({
      success: true,
      requestDetail,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { getPeople, sendFriendRequest, getRequestInfo };
