const Message = require("../models/message");

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

module.exports = { saveMessage, getMessages, getMessagesApi };
