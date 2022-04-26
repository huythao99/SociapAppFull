const express = require("express");
const chatRoute = express.Router();

const verifyToken = require("../validation/verifyToken");

const {
  getConversation,
  getAllMessage,
  createMessage,
} = require("../controller/chat");

// get conversation
chatRoute.get("/getConversation", verifyToken, getConversation);

chatRoute.get("/getAllMessage", verifyToken, getAllMessage);

chatRoute.post("/sendMessage", verifyToken, createMessage);

module.exports = chatRoute;
