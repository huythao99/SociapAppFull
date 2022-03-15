const mongoose = require("mongoose");

const Message = new mongoose.Schema({
  timeCreate: {
    type: Number,
    default: Date.now(),
  },
  content: {
    type: String,
    default: "",
  },
  urlImage: {
    type: String,
    default: null,
  },
  senderID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  receiverID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Message", Message);
