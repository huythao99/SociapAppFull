const express = require("express");
const router = express.Router();

const verifyToken = require("../validation/verifyToken");

const {
  getConversation,
  getAllMessage,
  createMessage,
} = require("../controller/chat");

// get conversation
router.get("/conversation", verifyToken, getConversation);

router.get("/message", verifyToken, getAllMessage);

router.post("/message", verifyToken, createMessage);

module.exports = router;
