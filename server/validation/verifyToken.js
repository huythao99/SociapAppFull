const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const verifyToken = async (req, res, next) => {
  const token = req.header("auth-token");
  try {
    if (!token) {
      return res.status(401).json({ status: 0, message: "Access Denined" });
    } else {
      const verified = jwt.verify(token, process.env.SECRET_KEY);
      const user = await User.findById({ _id: verified._id });
      if (!user.token) {
        return res.status(401).json({ message: "Invalid Token", status: 0 });
      }
      req.user = verified;
      next();
    }
  } catch (error) {
    res.status(401).json({ message: "Invalid Token", status: 0 });
  }
};

module.exports = verifyToken;
