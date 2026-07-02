const mongoose = require("mongoose");

const groupMessageSchema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    text: {
      type: String,
      default: "",
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

module.exports = mongoose.model("GroupMessage", groupMessageSchema);
