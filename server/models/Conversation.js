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
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
  },
  timeSend: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Conversation", Conversation);
