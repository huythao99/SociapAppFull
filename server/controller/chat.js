const { ITEMS_IN_PAGE } = require("../constants");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const { sortID } = require("../ultilities/Ultilities");

const mongoose = require("mongoose");

const createMessage = async (message) => {
  const newMessage = new Message({
    content: message.content,
    urlImage: message.urlImage,
    senderID: mongoose.Types.ObjectId(message.senderID),
    receiverID: mongoose.Types.ObjectId(message.receiverID._id),
    timeCreate: Date.now(),
  });
  const dataToSave = await newMessage.save();
  const conversation = await Conversation.findById(
    sortID(message.senderID, message.receiverID._id)
  );
  const newListMessage = conversation ? [...conversation.message] : [];
  newListMessage.push(dataToSave._doc._id);
  if (conversation) {
    const option = { new: true };
    await Conversation.findOneAndUpdate(
      { _id: sortID(message.senderID, message.receiverID._id) },
      {
        message: newListMessage,
        senderID: mongoose.Types.ObjectId(message.senderID),
        content: message.content === "" ? "Đã gửi một ảnh" : message.content,
        receiverID: mongoose.Types.ObjectId(message.receiverID._id),
        timeSend: dataToSave._doc.timeCreate,
        urlImage: message.urlImage,
      },
      option
    );
  } else {
    const newConversation = new Conversation({
      _id: sortID(message.senderID, message.receiverID._id),
      content: message.content === "" ? "Đã gửi một ảnh" : message.content,
      receiverID: mongoose.Types.ObjectId(message.receiverID._id),
      senderID: mongoose.Types.ObjectId(message.senderID),
      urlImage: message.urlImage,
      message: newListMessage,
      timeSend: dataToSave._doc.timeCreate,
    });
    await newConversation.save();
  }
};

const updateConversation = async (roomID) => {
  const response = await Conversation.findById({
    _id: roomID,
  })
    .populate({
      path: "senderID",
      select: "name _id avatar",
    })
    .populate({
      path: "receiverID",
      select: "name _id avatar",
    });
  return response;
};

const getConversation = async (req, res) => {
  try {
    const currentPage = Number(req.query.page || 1);
    const data = await Conversation.find({
      $or: [{ userCreator: req.user._id }, { participants: req.user._id }],
    })
      .populate({
        path: "userCreator",
        select: "name _id avatar",
      })
      .populate({
        path: "participants",
        select: "name _id avatar",
      })
      .sort({ timeSend: -1 })
      .skip((currentPage - 1) * ITEMS_IN_PAGE)
      .limit(ITEMS_IN_PAGE);
    const total = await Conversation.countDocuments({
      $or: [{ userCreator: req.user._id }, { participants: req.user._id }],
    });
    return res.status(200).json({
      status: 1,
      message: "get conversation success",
      listConversation: data,
      current_page: currentPage,
      total: total,
    });
  } catch (error) {
    return res.status(200).json({ message: error.message, status: 0 });
  }
};

const getAllMessage = async (req, res) => {
  try {
    const currentPage = Number(req.query.page || 1);
    const arrayParticipants = JSON.parse(req.query.participants).map((item) =>
      mongoose.Types.ObjectId(item)
    );
    const listMessage = await Message.find({
      participants: { $all: [...arrayParticipants] },
    })
      .populate({
        path: "participants",
        select: "name _id avatar",
      })
      .populate({
        path: "userSend",
        select: "name _id avatar",
      });
    const total = await Message.countDocuments({
      participants: { $all: [...arrayParticipants] },
    });
    return res.status(200).json({
      status: 1,
      message: "get list messenger success",
      listMessage: listMessage,
      current_page: currentPage,
      total: total,
    });
  } catch (error) {
    return res.status(200).json({ status: 0, message: error.message });
  }
};

module.exports = {
  createMessage,
  updateConversation,
  getConversation,
  getAllMessage,
};
