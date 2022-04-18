const express = require("express");
const verifyToken = require("../validation/verifyToken");
const {
  getAllUser,
  getDataUser,
  updateAvatarUser,
  updateCoverImageUser,
} = require("./../controller/user");
const multer = require("multer");

const userRoute = express.Router();

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

// get all User
userRoute.get("/getAllUser", verifyToken, getAllUser);

// get all User
userRoute.get("/getDataUser", verifyToken, getDataUser);

// update avatar user
userRoute.patch("/updateAvatar", verifyToken, upload, updateAvatarUser);

// update cover image
userRoute.patch("/updateCoverImage", verifyToken, upload, updateCoverImageUser);

module.exports = userRoute;
