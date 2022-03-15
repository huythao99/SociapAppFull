const mongoose = require("mongoose");

const Conversation = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  senderID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  receiverID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  timeSend: {
    type: Date,
    require: true,
  },
  message: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
});

module.exports = mongoose.model("Conversation", Conversation);
