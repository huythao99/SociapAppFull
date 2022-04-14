const Post = require("../models/Post");
const Comment = require("../models/Comment");
const { ITEMS_IN_PAGE } = require("../constants");
const cloudinary = require("cloudinary");

const getPostByID = async (idPost) => {
  const post = await Post.findById({ _id: idPost }).populate({
    path: "creater",
    select: "name _id avatar",
  });
  return post;
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
    if (req.file) {
      const uriImage = await cloudinary.v2.uploader.upload(`${req.file.path}`, {
        public_id: req.file.filename + Date.now(),
      });
      const newPost = new Post({
        creater: req.user._id,
        content: req.body.content,
        uriImage: uriImage.url,
      });
      const dataToSave = await newPost.save();
      return res.status(200).json({
        status: 1,
        message: "create post success",
        post: dataToSave._doc,
      });
    } else {
      const newPost = new Post({
        creater: req.user._id,
        content: req.body.content,
      });
      const dataToSave = await newPost.save();
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
    const listUserLikePost = [...post.listIDUserLike];
    const indexUserLikedPost = listUserLikePost.findIndex(
      (item) => item.userID === req.user._id
    );
    if (indexUserLikedPost === -1) {
      listUserLikePost.push({
        userID: req.user._id,
      });
    } else {
      listUserLikePost.splice(indexUserLikedPost, 1);
    }
    const options = { new: true };
    const dataUpdate = await Post.findByIdAndUpdate(
      req.query.postID,
      {
        listIDUserLike: listUserLikePost,
      },
      options
    );
    return res.status(200).json({
      message: "request success",
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

module.exports = {
  getPostByID,
  getAllPost,
  createPost,
  likePost,
  getComment,
  createComment,
  getCommentByID,
};
