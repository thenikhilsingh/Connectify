const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reciever: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: false,
    },
    file: {
      url: {
        type: String,
        default: "",
      },

      public_id: {
        type: String,
        default: "",
      },

      originalName: {
        type: String,
        default: "",
      },

      type: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Message", messageSchema);
