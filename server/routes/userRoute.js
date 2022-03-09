const express = require("express");
const { ITEMS_IN_PAGE } = require("../constants");
const User = require("../models/User");
const verifyToken = require("../validation/verifyToken");

const userRoute = express.Router();

// get all User
userRoute.get("/getAllUser", verifyToken, async (req, res) => {
  try {
    const currentPage = Number(req.query.page || 1);
    const listUser = await User.find()
      .skip((currentPage - 1) * ITEMS_IN_PAGE)
      .limit(ITEMS_IN_PAGE);
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
    });
  } catch (error) {
    return res.status(400).json({ status: 0, message: error.message });
  }
});

// update avatar user

module.exports = userRoute;
