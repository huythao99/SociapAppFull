const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { ITEMS_IN_PAGE } = require("../constants");
const cloudinary = require("cloudinary");
require("dotenv").config();
const {
  validationSignup,
  validationSignin,
} = require("../validation/validation");
const { sendNotifiOfFollow } = require("../controller/notification");

const getAllFCMTokenUser = async (userID) => {
  const listFCMToken = await User.find({ _id: { $ne: userID } }).select(
    "fcmToken"
  );
  const newListFCMToken = listFCMToken.map((item) => {
    return item.fcmToken;
  });
  return newListFCMToken || [];
};

const signin = async (req, res) => {
  try {
    const { error } = validationSignin(req.body);
    if (error) {
      return res
        .status(400)
        .json({ message: error.details[0].message, status: 0 });
    }
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "email or password is wrong", status: 0 });
    } else {
      const validatePassword = bcrypt.compare(req.body.password, user.password);
      if (!validatePassword) {
        return res
          .status(400)
          .json({ status: 0, message: "Email or password is wrong" });
      } else {
        const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY);
        const option = { new: true };

        const response = await User.findByIdAndUpdate(
          { _id: user._id },
          { token: token, fcmToken: req.body.fcmtoken },
          option
        );
        res
          .header("auth-token", token)
          .status(200)
          .json({
            status: 1,
            message: "Signin Success",
            token: token,
            name: user.name,
            id: user._id,
            ...req.body,
            avatar: response.avatar,
            coverImage: response.coverImage,
            listFollow: response.listFollow,
            listFollower: response.listFollower,
          });
      }
    }
  } catch (error) {
    return res.status(400).send({
      status: 0,
      message: error.message,
    });
  }
};

const signup = async (req, res) => {
  try {
    const { error } = validationSignup(req.body);
    if (error) {
      return res
        .status(400)
        .json({ message: error.details[0].message, status: 0 });
    }
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ message: "email exist", status: 0 });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashPassword,
      avatar: req.body.avatar,
    });
    const dataSave = await newUser.save();
    return res.status(200).json({
      status: 1,
      message: "signup success",
      user: {
        ...req.body,
        id: dataSave._doc._id,
      },
    });
  } catch (error) {
    return res.status(400).json({ message: error.message, status: 0 });
  }
};

const signout = async (req, res) => {
  try {
    const option = {
      new: true,
    };
    await User.findByIdAndUpdate(
      { _id: req.user._id },
      { token: null, fcmToken: null },
      option
    );
    return res.header("auth-token", null).status(200).json({
      message: "logout success",
      status: 1,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message, status: 0 });
  }
};

const getAllUser = async (req, res) => {
  try {
    const currentPage = Number(req.query.page || 1);
    const listUser = await User.find({
      name: { $regex: new RegExp(req.query.filter.trim(), "i") },
    })
      .sort({ name: "desc" })
      .skip((currentPage - 1) * ITEMS_IN_PAGE)
      .limit(ITEMS_IN_PAGE);
    const totalUser = await User.countDocuments({
      name: new RegExp(req.query.filter),
    });
    const newListUser = listUser.map((item) => {
      return {
        id: item._id,
        name: item.name,
        avatar: item.avatar,
      };
    });
    return res.status(200).json({
      status: 1,
      message: "get list user success",
      listUser: newListUser,
      current_page: currentPage,
      total: totalUser,
    });
  } catch (error) {
    return res.status(400).json({ status: 0, message: error.message });
  }
};

const getDataUser = async (req, res) => {
  try {
    const currentPage = Number(req.query.page || 1);
    const dataUser = await User.findById({ _id: req.query.uid });
    const listPost = await Post.find({ creater: req.query.uid })
      .populate({ path: "creater", select: "name _id avatar" })
      .sort({ timeCreate: -1 })
      .skip((currentPage - 1) * ITEMS_IN_PAGE)
      .limit(ITEMS_IN_PAGE);
    const totalPostOfUser = await Post.countDocuments({
      creater: req.query.uid,
    });
    const newDataUser = {
      id: dataUser._id,
      name: dataUser.name,
      avatar: dataUser.avatar,
      coverImage: dataUser.coverImage,
      listPost: listPost,
      listFollow: dataUser.listFollow,
      listFollower: dataUser.listFollower,
      totalPostOfUser: totalPostOfUser,
    };
    return res.status(200).json({
      status: 1,
      message: "get list user success",
      dataUser: newDataUser,
      current_page: currentPage,
      totalPost: totalPostOfUser,
    });
  } catch (error) {
    return res.status(400).json({ status: 0, message: error.message });
  }
};

const updateAvatarUser = async (req, res) => {
  try {
    if (req.file) {
      const uriImage = await cloudinary.v2.uploader.upload(`${req.file.path}`, {
        public_id: "avatar" + req.file.filename + Date.now(),
      });
      const option = { new: true };
      await User.findByIdAndUpdate(
        { _id: req.user._id },
        { avatar: uriImage.url },
        option
      );
      return res.status(200).json({
        status: 1,
        message: "Update success",
        avatar: uriImage.url,
      });
    } else {
      return res.status(400).json({ status: 0, message: "cannot read file" });
    }
  } catch (error) {
    return res.status(400).json({ status: 0, message: error.message });
  }
};

const updateCoverImageUser = async (req, res) => {
  try {
    if (req.file) {
      const uriImage = await cloudinary.v2.uploader.upload(`${req.file.path}`, {
        public_id: "cover_image" + req.file.filename + Date.now(),
      });
      const option = { new: true };
      await User.findByIdAndUpdate(
        { _id: req.user._id },
        { coverImage: uriImage.url },
        option
      );
      return res.status(200).json({
        status: 1,
        message: "Update success",
        coverImage: uriImage.url,
      });
    } else {
      return res.status(400).json({ status: 0, message: "cannot read file" });
    }
  } catch (error) {
    return res.status(400).json({ status: 0, message: error.message });
  }
};

// follow
const followUser = async (req, res) => {
  try {
    const user = await User.findOne({
      $and: [
        {
          listFollow: req.body.userID,
        },
        {
          _id: req.user._id,
        },
      ],
    });
    const option = { new: true };
    if (user) {
      await User.findByIdAndUpdate(
        { _id: req.user._id },
        {
          $pull: {
            listFollow: req.body.userID,
          },
        },
        option
      );
      await User.findByIdAndUpdate(
        { _id: req.body.userID },
        {
          $pull: {
            listFollower: req.user._id,
          },
        },
        option
      );
    } else {
      await User.findByIdAndUpdate(
        { _id: req.user._id },
        {
          $push: {
            listFollow: req.body.userID,
          },
        }
      );
      await User.findByIdAndUpdate(
        { _id: req.body.userID },
        {
          $push: {
            listFollower: req.user._id,
          },
        }
      );
      sendNotifiOfFollow(req.body.userID, req.user._id);
    }
    return res.status(200).json({
      status: 1,
      message: "follow success",
    });
  } catch (error) {
    return res.status(400).json({ status: 0, message: error.message });
  }
};

module.exports = {
  getAllFCMTokenUser,
  signin,
  signup,
  signout,
  getAllUser,
  getDataUser,
  updateAvatarUser,
  updateCoverImageUser,
  followUser,
};
