const Post = require("../models/Post");
var mongoose = require("mongoose");
const Comment = require("../models/Comment");
const { ITEMS_IN_PAGE } = require("../constants");
const cloudinary = require("cloudinary");
const {
  sendNotifiOfNewPost,
  sendNotificationOfComment,
  sendNotificationOfReport,
} = require("../controller/notification");
const { getTopicOfPost } = require("../utilities/post");
const Report = require("../models/Report");

const getPostByID = async (idPost) => {
  const post = await Post.findById({ _id: idPost }).populate({
    path: "creater",
    select: "name _id avatar",
  });
  return post;
};

const getDetailPost = async (req, res) => {
  try {
    const post = await Post.findById({ _id: req.query.postId }).populate({
      path: "creater",
      select: "name _id avatar",
    });
    return res.status(200).json({
      status: 1,
      message: "get detail post success",
      post: post,
    });
  } catch (error) {
    return res.status(400).json({ status: 0, message: error.message });
  }
};

const editPost = async (req, res) => {
  try {
    const topic = await getTopicOfPost({ data: req.body.content });
    const options = { new: true };
    if (req.file) {
      const uriImage = await cloudinary.v2.uploader.upload(`${req.file.path}`, {
        public_id: req.file.filename + Date.now(),
      });
      await Post.findByIdAndUpdate(
        mongoose.Types.ObjectId(req.body.postID),
        {
          topic,
          content: req.body.content,
          uriImage: uriImage.url,
        },
        options
      );
      const dataUpdate = await Post.findById(
        mongoose.Types.ObjectId(req.body.postID)
      ).populate({
        path: "creater",
        select: "name _id avatar",
      });
      return res.status(200).json({
        status: 1,
        message: "edit post success",
        post: dataUpdate._doc,
      });
    } else {
      if (!req.body.oldImage) {
        await Post.findByIdAndUpdate(
          mongoose.Types.ObjectId(req.body.postID),
          {
            content: req.body.content,
            uriImage: null,
            topic,
          },
          options
        );
        const dataUpdate = await Post.findById(
          mongoose.Types.ObjectId(req.body.postID)
        ).populate({
          path: "creater",
          select: "name _id avatar",
        });
        return res.status(200).json({
          status: 1,
          message: "edit post success",
          post: dataUpdate._doc,
        });
      } else {
        await Post.findByIdAndUpdate(
          req.body.postID,
          {
            content: req.body.content,
            topic,
          },
          options
        );
        const dataUpdate = await Post.findById(
          mongoose.Types.ObjectId(req.body.postID)
        ).populate({
          path: "creater",
          select: "name _id avatar",
        });
        return res.status(200).json({
          status: 1,
          message: "edit post success",
          post: dataUpdate._doc,
        });
      }
    }
  } catch (error) {
    return res.status(400).json({ status: 0, message: error.message });
  }
};

const getCommentByID = async (idComment) => {
  const post = await Comment.findById({ _id: idComment }).populate({
    path: "user",
    select: "name _id avatar",
  });
  return post;
};

const getAllPost = async (req, res) => {
  try {
    const currentPage = Number(req.query.page || 1);
    const listPost = await Post.find()
      .populate({ path: "creater", select: "name _id avatar" })
      .sort({ timeCreate: -1 })
      .skip((currentPage - 1) * ITEMS_IN_PAGE)
      .limit(ITEMS_IN_PAGE);
    const totalPost = await Post.countDocuments({});
    return res.status(200).json({
      status: 1,
      message: "get list post success",
      listPost: listPost,
      current_page: currentPage,
      total: totalPost,
    });
  } catch (error) {
    return res.status(400).json({ status: 0, message: error.message });
  }
};

const createPost = async (req, res) => {
  try {
    const topic = await getTopicOfPost({ data: req.body.content });
    if (req.file) {
      const uriImage = await cloudinary.v2.uploader.upload(`${req.file.path}`, {
        public_id: req.file.filename + Date.now(),
      });

      const newPost = new Post({
        creater: req.user._id,
        content: req.body.content,
        uriImage: uriImage.url,
        topic,
      });
      const dataToSave = await newPost.save();
      sendNotifiOfNewPost(req.user._id, dataToSave._doc._id);
      return res.status(200).json({
        status: 1,
        message: "create post success",
        post: dataToSave._doc,
      });
    } else {
      const newPost = new Post({
        creater: req.user._id,
        content: req.body.content,
        topic,
      });
      const dataToSave = await newPost.save();
      sendNotifiOfNewPost(req.user._id, dataToSave._doc._id);
      return res.status(200).json({
        status: 1,
        message: "create post success",
        post: dataToSave._doc,
      });
    }
  } catch (error) {
    return res.status(400).json({ status: 0, message: error.message });
  }
};

const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.query.postID);
    const listUserLikePost = [...post.listUserLike];
    const indexUserLikedPost = listUserLikePost.findIndex(
      (item) =>
        mongoose.Types.ObjectId(item.userID) ===
        mongoose.Types.ObjectId(req.user._id)
    );
    if (indexUserLikedPost === -1) {
      listUserLikePost.push(req.user._id);
    } else {
      listUserLikePost.splice(indexUserLikedPost, 1);
    }
    const options = { new: true };
    const dataUpdate = await Post.findByIdAndUpdate(
      req.query.postID,
      {
        listUserLike: [...listUserLikePost],
      },
      options
    );
    return res.status(200).json({
      message: "like post success",
      status: 1,
      post: { ...dataUpdate._doc },
    });
  } catch (error) {
    return res.status(400).json({ status: 0, message: error.message });
  }
};

const getComment = async (req, res) => {
  try {
    const currentPage = Number(req.query.page || 1);
    const comment = await Comment.find({ post: req.query.postID })
      .populate({ path: "user", select: "name _id avatar" })
      .sort({ timeCreate: -1 })
      .skip((currentPage - 1) * ITEMS_IN_PAGE)
      .limit(ITEMS_IN_PAGE);
    const totalComment = await Comment.countDocuments({
      post: req.query.postID,
    });
    return res.status(200).json({
      message: "request success",
      status: 1,
      listComment: comment,
      total: totalComment,
      current_page: currentPage,
    });
  } catch (error) {
    return res.status(400).json({ status: 0, message: error.message });
  }
};

const createComment = async (req, res) => {
  try {
    const options = { new: true };
    if (req.file) {
      const uriImage = await cloudinary.v2.uploader.upload(`${req.file.path}`, {
        public_id: "comment" + req.file.filename + Date.now(),
      });
      const newComment = new Comment({
        user: req.user._id,
        content: req.body.content,
        uriImage: uriImage.url,
        post: req.body.postID,
      });
      const dataToSave = await newComment.save();
      await Post.findByIdAndUpdate(
        { _id: req.body.postID },
        { $push: { listComment: dataToSave._doc._id } },
        options
      );
      sendNotificationOfComment(req.user._id, req.body.postID);
      return res.status(200).json({
        status: 1,
        message: "create comment success",
        comment: dataToSave._doc,
      });
    } else {
      const newComment = new Comment({
        user: req.user._id,
        content: req.body.content,
        post: req.body.postID,
      });
      const dataToSave = await newComment.save();
      await Post.findByIdAndUpdate(
        { _id: req.body.postID },
        { $push: { listComment: dataToSave._doc._id } },
        options
      );
      sendNotificationOfComment(req.user._id, req.body.postID);
      return res.status(200).json({
        status: 1,
        message: "create comment success",
        comment: dataToSave._doc,
      });
    }
  } catch (error) {
    return res.status(400).json({ status: 0, message: error.message });
  }
};

const reportPost = async (req, res) => {
  try {
    const newReport = new Report({
      user: req.user._id,
      content: req.body.content,
      post: req.body.postID,
    });
    await newReport.save();
    sendNotificationOfReport(req.body.postID, req.body.content);
    return res.status(200).json({
      status: 1,
      message: "report success",
    });
  } catch (error) {
    return res.status(400).json({ status: 0, message: error.message });
  }
};

module.exports = {
  getPostByID,
  getAllPost,
  createPost,
  likePost,
  getComment,
  createComment,
  getCommentByID,
  reportPost,
  getDetailPost,
  editPost,
};
