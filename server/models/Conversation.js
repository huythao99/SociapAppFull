const mongoose = require("mongoose");

const Conversation = new mongoose.Schema({
  userCreator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  lastMessage: {
    type: String,
    default: "",
  },
  timeSend: {
    type: Date,
    default: Date.now,
  },
  userSend: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  isSeen: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Conversation", Conversation);
