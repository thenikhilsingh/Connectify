const Friend = require("../models/friend");

const getFriends = async (req, res) => {
  try {
    const userId = req.user._id;
    const friends = await Friend.find({
      status: "accepted",
      $or: [{ sender: userId }, { reciever: userId }],
    })
      .populate("sender")
      .populate("reciever");

    const friendList = friends.map((friend) => {
      if (friend.sender._id.toString() === userId.toString()) {
        return friend.reciever;
      }

      return friend.sender;
    });
    res.status(200).json({
      success: true,
      message: "friends fetched successfully!",
      friendList,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error!",
      error: error.message,
    });
  }
};

module.exports = { getFriends };
