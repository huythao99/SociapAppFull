const mongoose = require("mongoose");

const Report = mongoose.Schema({
  timeCreate: {
    type: Date,
    default: Date.now,
  },
  content: {
    type: String,
    default: "",
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

module.exports = mongoose.model("Report", Report);
