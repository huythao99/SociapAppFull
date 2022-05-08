const { string } = require("joi");
const { default: mongoose } = require("mongoose");
const mongo = require("mongoose");
const User = new mongo.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    require: true,
    min: 6,
    max: 32,
  },
  avatar: {
    type: String,
    default: null,
  },
  coverImage: {
    type: String,
    default: null,
  },
  token: {
    type: String || null,
  },
  fcmToken: {
    type: String || null,
  },
  // danh sach nguoi ma user theo doi
  listFollow: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  // danh sach nhung nguoi theo doi user
  listFollower: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  listPost: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
});

module.exports = mongo.model("User", User);
