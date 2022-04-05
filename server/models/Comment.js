const mongoose = require("mongoose");

const Comment = mongoose.Schema({
  timeCreate: {
    type: Date,
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
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
});

module.exports = mongoose.model("Comment", Comment);
