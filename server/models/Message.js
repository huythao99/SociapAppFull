const mongoose = require("mongoose");

const Message = new mongoose.Schema({
  timeCreate: {
    type: Number,
    default: Date.now,
  },
  content: {
    type: String,
    default: "",
  },
  urlImage: {
    type: String,
    default: null,
  },
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
  },
  userSend: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

module.exports = mongoose.model("Message", Message);
