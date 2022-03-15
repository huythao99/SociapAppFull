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
  token: {
    type: String || null,
  },
  fcmToken: {
    type: String || null,
  },
});

module.exports = mongo.model("User", User);
