const express = require("express");
const Post = require("../models/Post");
const User = require("../models/User");
const verifyToken = require("../validation/verifyToken");
const { ITEMS_IN_PAGE } = require("../constants");

const postRoute = express.Router();

// get all post
postRoute.get("/getAllPost", verifyToken, async (req, res) => {
  try {
    const currentPage = Number(req.query.page || 1);
    const listPost = await Post.find()
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
});

// create post
postRoute.post("/createPost", verifyToken, async (req, res) => {
  try {
    const newPost = new Post({
      userId: req.user._id,
      timeCreate: Date.now(),
      content: req.body.content,
      ...(req.body.uriImage && { uriImage: req.body.uriImage }),
      ...(req.body.uriVideo && { uriVideo: req.body.uriVideo }),
    });
    const dataToSave = await newPost.save();
    return res.status(200).json({
      status: 1,
      message: "create post success",
      post: dataToSave._doc,
    });
  } catch (error) {
    return res.status(400).json({ status: 0, message: error.message });
  }
});

// like post
postRoute.patch("/likePost", verifyToken, async (req, res) => {
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
});

module.exports = postRoute;
