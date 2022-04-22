const express = require("express");
const chatRoute = express.Router();

const verifyToken = require("../validation/verifyToken");

const { getConversation, getAllMessage } = require("../controller/chat");

// get conversation
chatRoute.get("/getConversation", verifyToken, getConversation);

chatRoute.get("/getAllMessage", verifyToken, getAllMessage);

module.exports = chatRoute;
