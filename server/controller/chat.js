const { default: mongoose } = require("mongoose");
const { ITEMS_IN_PAGE } = require("../constants");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const { sortID } = require("../ultilities/Ultilities");

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

module.exports = { createMessage, updateConversation };
