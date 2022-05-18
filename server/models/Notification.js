const { types } = require("joi");
const { default: mongoose } = require("mongoose");
const mongo = require("mongoose");
const Notification = new mongo.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  timeCreate: {
    type: Date,
    default: Date.now,
  },
  body: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  isSeen: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongo.model("Notification", Notification);
