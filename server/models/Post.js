const mongoose = require("mongoose");

const Post = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  timeCreate: {
    type: Number,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  uriImage: {
    type: String,
    default: null,
  },
  uriVideo: {
    type: String,
    default: null,
  },
  numberOfLike: {
    type: Number,
    default: 0,
  },
  numberOfComment: {
    type: Number,
    default: 0,
  },
  numberOfShare: {
    type: Number,
    default: 0,
  },
  listIDUserLike: {
    type: Array,
    default: [],
  },
});

module.exports = mongoose.model("Post", Post);
