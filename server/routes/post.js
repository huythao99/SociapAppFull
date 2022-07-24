const express = require("express");
const { verify } = require("jsonwebtoken");
const multer = require("multer");
const {
  getAllPost,
  likePost,
  getComment,
  createPost,
  createComment,
  reportPost,
  getDetailPost,
  editPost,
} = require("../controller/post");
const verifyToken = require("../validation/verifyToken");

const router = express.Router();
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
router.get("/", verifyToken, getAllPost);
// detail post
router.get("/detail", verifyToken, getDetailPost);

// create post
router.post("/", verifyToken, upload, createPost);
// edit post

router.patch("/edit", verify, upload, editPost);
// like post
router.patch("/like", verifyToken, likePost);

// get list comment
router.get("/comment", verifyToken, getComment);

// create comment
router.post("/comment", verifyToken, upload, createComment);

router.post("/report", verifyToken, reportPost);

module.exports = router;
