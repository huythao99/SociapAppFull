const mongoose = require("mongoose");

const FriendRequest = mongoose.Schema({
  userSend: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  userReceiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  timeCreated: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "none",
  },
});

module.exports = mongoose.model("FriendRequest", FriendRequest);
