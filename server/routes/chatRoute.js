const express = require("express");
const chatRoute = express.Router();
const Conversation = require("../models/Conversation");
const verifyToken = require("../validation/verifyToken");
const { sortID } = require("../ultilities/Ultilities");
const { ITEMS_IN_PAGE } = require("../constants");
const Message = require("../models/Message");
const mongoose = require("mongoose");

// get conversation
chatRoute.get("/getConversation", verifyToken, async (req, res) => {
  try {
    const currentPage = Number(req.query.page || 1);
    const data = await Conversation.find({
      _id: new RegExp(".*" + req.user._id + ".*"),
    })
      .populate({
        path: "senderID",
        select: "name _id avatar",
      })
      .populate({
        path: "receiverID",
        select: "name _id avatar",
      })
      .sort({ timeSend: -1 })
      .skip((currentPage - 1) * ITEMS_IN_PAGE)
      .limit(ITEMS_IN_PAGE);
    return res.status(200).json({
      status: 1,
      message: "get conversation success",
      listConversation: data,
      current_page: currentPage,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message, status: 0 });
  }
});

chatRoute.get("/getAllMessage", verifyToken, async (req, res) => {
  try {
    const currentPage = Number(req.query.page || 1);
    const conversation = await Conversation.findById(
      sortID(req.user._id, req.query.receiverID)
    ).populate({
      path: "message",
      match: {
        timeCreate: { $gt: 1647022183186 },
      },
      options: {
        sort: { timeCreate: -1 },
        skip: (currentPage - 1) * ITEMS_IN_PAGE,
        limit: ITEMS_IN_PAGE,
      },
      populate: { path: "senderID", select: "name _id avatar" },
      populate: { path: "receiverID", select: "name _id avatar" },
    });
    return res.status(200).json({
      status: 1,
      message: "get list messenger success",
      listMessage: conversation.message,
      current_page: currentPage,
      count: conversation.message.length,
    });
  } catch (error) {
    return res.status(400).json({ status: 0, message: error.message });
  }
});

chatRoute.patch("/sendMessage", verifyToken, async (req, res) => {
  console.log(Date.now());
  console.log(typeof Date.now());
  try {
    const newMessage = new Message({
      content: req.body.content,
      urlImage: req.body.urlImage,
      senderID: req.user._id,
      receiverID: mongoose.Types.ObjectId(req.body.receiverID),
      timeCreate: Date.now(),
    });
    const dataToSave = await newMessage.save();
    const conversation = await Conversation.findById(
      sortID(req.user._id, req.body.receiverID)
    );
    const newListMessage = conversation ? [...conversation.message] : [];
    newListMessage.push(dataToSave._doc._id);
    if (conversation) {
      const option = { new: true };
      await Conversation.findOneAndUpdate(
        { _id: sortID(req.user._id, req.body.receiverID) },
        {
          message: newListMessage,
          senderID: req.user._id,
          content:
            req.body.content === "" ? "Đã gửi một ảnh" : req.body.content,
          receiverID: mongoose.Types.ObjectId(req.body.receiverID),
          timeSend: dataToSave._doc.timeCreate,
        },
        option
      );
    } else {
      const newConversation = new Conversation({
        _id: sortID(req.user._id, req.body.receiverID),
        content: req.body.content === "" ? "Đã gửi một ảnh" : req.body.content,
        receiverID: mongoose.Types.ObjectId(req.body.receiverID),
        senderID: req.user._id,
        urlImage: req.body.urlImage,
        message: newListMessage,
        timeSend: dataToSave._doc.timeCreate,
      });
      await newConversation.save();
    }
    return res.status(200).json({
      message: "send success",
      status: 1,
    });
  } catch (error) {
    return res.status(400).json({ status: 0, message: error.message });
  }
});

module.exports = chatRoute;
