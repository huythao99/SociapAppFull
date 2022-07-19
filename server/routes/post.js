const express = require("express");
const multer = require("multer");
const {
  getAllPost,
  likePost,
  getComment,
  createPost,
  createComment,
  // createComment,
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

// create post
router.post("/", verifyToken, upload, createPost);

// like post
router.patch("/like", verifyToken, likePost);

// get list comment
router.get("/comment", verifyToken, getComment);

// create comment
router.post("/comment", verifyToken, upload, createComment);

module.exports = router;
