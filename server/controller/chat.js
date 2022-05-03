const { ITEMS_IN_PAGE } = require("../constants");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

const mongoose = require("mongoose");

const getConversationByID = async (conversationID) => {
  const conversation = await Conversation.findById({
    _id: conversationID,
  })
    .populate({
      path: "userCreator",
      select: "name _id avatar",
    })
    .populate({
      path: "participants",
      select: "name _id avatar",
    });
  return conversation;
};

const updateStatusConversation = async (conversationID, userID) => {
  const option = { new: true };
  await Conversation.findOneAndUpdate(
    {
      $and: [
        {
          _id: conversationID,
        },
        {
          userSend: {
            $ne: userID,
          },
        },
      ],
    },
    { isSeen: true },
    option
  );
};

const createMessage = async (req, res) => {
  try {
    const message = req.body.message;
    if (message.conversation) {
      const newMessage = new Message({
        content: message.content,
        urlImage: message.urlImage,
        userSend: message.userSend,
        participants: message.participants,
        conversation: message.conversation,
      });
      const dataToSave = await newMessage.save();
      const messageResponse = await Message.findById(dataToSave._doc._id)
        .populate({
          path: "userSend",
          select: "name _id avatar",
        })
        .populate({
          path: "participants",
          select: "name _id avatar",
        });
      const option = { new: true };
      await Conversation.findOneAndUpdate(
        { _id: message.conversation },
        {
          userSend: mongoose.Types.ObjectId(message.userSend),
          lastMessage:
            message.content === "" ? "Đã gửi một ảnh" : message.content,
          timeSend: dataToSave._doc.timeCreate,
          isSeen: false,
        },
        option
      );
      return res.status(200).json({
        message: "create message success",
        status: 1,
        messageResponse: messageResponse,
      });
    } else {
      const newConversation = new Conversation({
        lastMessage:
          message.content === "" ? "Đã gửi một ảnh" : message.content,
        userSend: mongoose.Types.ObjectId(message.userSend),
        userCreator: mongoose.Types.ObjectId(message.userSend),
        participants: message.participants,
      });
      const dataSave = await newConversation.save();
      const newMessage = new Message({
        content: message.content,
        urlImage: message.urlImage,
        userSend: message.userSend,
        participants: message.participants,
        conversation: dataSave._doc._id,
      });
      const dataToSaveMessage = await newMessage.save();
      const messageResponse = await Message.findById(dataToSaveMessage._doc._id)
        .populate({
          path: "userSend",
          select: "name _id avatar",
        })
        .populate({
          path: "participants",
          select: "name _id avatar",
        });
      return res.status(200).json({
        message: "create message success",
        status: 1,
        message: messageResponse,
      });
    }
  } catch (error) {
    return res.status(400).json({
      status: 0,
      message: error.message,
    });
  }
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
    const totalNotRead = await Conversation.countDocuments({
      $and: [
        {
          $or: [{ userCreator: req.user._id }, { participants: req.user._id }],
        },
        {
          isSeen: false,
        },
      ],
    });
    return res.status(200).json({
      status: 1,
      message: "get conversation success",
      listConversation: data,
      current_page: currentPage,
      total: total,
      totalNotRead: totalNotRead,
    });
  } catch (error) {
    return res.status(200).json({ message: error.message, status: 0 });
  }
};

const getAllMessage = async (req, res) => {
  try {
    const currentPage = Number(req.query.page || 1);
    // navigate tu man danh sach cuoc hoi thoai
    if (req.query.conversationID) {
      const listMessage = await Message.find({
        conversation: req.query.conversationID,
      })
        .populate({
          path: "participants",
          select: "name _id avatar",
        })
        .populate({
          path: "userSend",
          select: "name _id avatar",
        })
        .sort({ timeCreate: -1 });
      const total = await Message.countDocuments({
        conversation: req.query.conversationID,
      });
      return res.status(200).json({
        status: 1,
        message: "get list messenger success",
        listMessage: listMessage,
        current_page: currentPage,
        total: total,
        conversationID: req.query.conversationID,
      });
    } else {
      // chat don, navigate tu trang ca nhan cua user
      const arrayParticipants = req.query.participants.map((item) =>
        mongoose.Types.ObjectId(item)
      );
      const listMessage = await Message.find({
        $and: [
          {
            participants: { $all: [...arrayParticipants] },
          },
          {
            participants: { $size: 2 },
          },
        ],
      })
        .populate({
          path: "participants",
          select: "name _id avatar",
        })
        .populate({
          path: "userSend",
          select: "name _id avatar",
        })
        .sort({ timeCreate: -1 });
      const total = await Message.countDocuments({
        $and: [
          { participants: { $all: [...arrayParticipants] } },
          { participants: { $size: 2 } },
        ],
      });
      if (total === 0) {
        const newConversation = new Conversation({
          userCreator: req.user._id,
          participants: arrayParticipants,
          lastMessage: "",
          userSend: req.user._id,
        });
        const dataToSaveConversation = await newConversation.save();
        return res.status(200).json({
          status: 1,
          message: "get list messenger success",
          listMessage: listMessage,
          current_page: currentPage,
          total: total,
          conversationID: dataToSaveConversation._doc._id,
        });
      } else {
        return res.status(200).json({
          status: 1,
          message: "get list messenger success",
          listMessage: listMessage,
          current_page: currentPage,
          total: total,
          conversationID: listMessage[0].conversation,
        });
      }
    }
  } catch (error) {
    return res.status(400).json({ status: 0, message: error.message });
  }
};

module.exports = {
  createMessage,
  getConversation,
  getAllMessage,
  getConversationByID,
  updateStatusConversation,
};
