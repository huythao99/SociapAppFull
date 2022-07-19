const mongoose = require("mongoose");

const Post = new mongoose.Schema({
  creater: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  timeCreate: {
    type: Date,
    default: Date.now,
  },
  content: {
    type: String,
    required: true,
  },
  uriImage: {
    type: String,
    default: null,
  },
  listUserLike: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  listComment: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  topic: {
    type: String,
  },
});

module.exports = mongoose.model("Post", Post);
