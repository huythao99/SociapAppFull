const Post = require("../models/Post");
const { ITEMS_IN_PAGE } = require("../constants");
const cloudinary = require("cloudinary");

const getPostByID = async (idPost) => {
  const post = await Post.findById({ _id: idPost }).populate({
    path: "creater",
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
    return res.status(200).json({
      status: 1,
      message: "get list post success",
      listPost: listPost,
      current_page: currentPage,
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
    console.log(error);
    return res.status(400).json({ status: 0, message: error.message });
  }
};

module.exports = { getPostByID, getAllPost, createPost };
