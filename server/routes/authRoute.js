const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const authRoute = express.Router();
const {
  validationSignup,
  validationSignin,
} = require("../validation/validation");

// signin
authRoute.post("/signin", async (req, res) => {
  try {
    const { error } = validationSignin(req.body);
    if (error) {
      return res
        .status(400)
        .json({ message: error.details[0].message, status: 0 });
    }
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .json({ message: "email or password is wrong", status: 0 });
    } else {
      const validatePassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validatePassword) {
        return res
          .status(200)
          .json({ status: 0, message: "Email or password is wrong" });
      } else {
        const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY);
        res
          .header("auth-token", token)
          .status(200)
          .json({
            status: 1,
            message: "Signin Success",
            token: token,
            name: user.name,
            id: user._id,
            ...req.body,
          });
      }
    }
  } catch (error) {
    return res.status(400).send({
      status: 0,
      message: error.message,
    });
  }
});

// signup
authRoute.post("/signup", async (req, res) => {
  try {
    const { error } = validationSignup(req.body);
    if (error) {
      return res
        .status(200)
        .json({ message: error.details[0].message, status: 0 });
    }
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(200).json({ message: "email exist", status: 0 });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashPassword,
      avatar: req.body.avatar,
    });
    const dataSave = await newUser.save();
    return res.status(200).json({
      status: 1,
      message: "signup success",
      user: {
        ...req.body,
        id: dataSave._doc._id,
      },
    });
  } catch (error) {
    return res.status(400).json({ message: error.message, status: 0 });
  }
});

module.exports = authRoute;
