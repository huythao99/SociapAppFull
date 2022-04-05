const express = require("express");
const multer = require("multer");
const Post = require("../models/Post");
const verifyToken = require("../validation/verifyToken");
const { getAllPost, createPost } = require("../controller/post");

const postRoute = express.Router();
const imageStorage = multer.diskStorage({
  // Destination to store image
  destination: "images",
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now());
    // file.fieldname is name of the field (image)
    // path.extname get the uploaded file extension
  },
});
const upload = multer({
  storage: imageStorage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
}).single("file");
// get all post
postRoute.get("/getAllPost", verifyToken, getAllPost);

// create post
postRoute.post("/createPost", verifyToken, upload, createPost);

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
