const express = require("express");
const multer = require("multer");
const Post = require("../models/Post");
const verifyToken = require("../validation/verifyToken");
const {
  getAllPost,
  createPost,
  likePost,
  getComment,
  createComment,
} = require("../controller/post");
const { MAX_SIZE } = require("../constants");

const postRoute = express.Router();
const imageStorage = multer.diskStorage({
  // Destination to store image
  destination: "images",
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now());
    // file.fieldname is name of the field (image)
    // path.extname get the uploaded file extension
  },
  limits: { fileSize: MAX_SIZE },
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
postRoute.patch("/likePost", verifyToken, likePost);

// get list comment
postRoute.get("/comment", verifyToken, getComment);

// create comment
postRoute.post("/createComment", verifyToken, upload, createComment);

module.exports = postRoute;
