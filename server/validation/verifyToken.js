const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  const token = req.header("auth-token");
  try {
    if (!token) {
      return res.status(200).json({ status: 0, message: "Access Denined" });
    } else {
      const verified = jwt.verify(token, process.env.SECRET_KEY);
      req.user = verified;
      next();
    }
  } catch (error) {
    res.status(400).json({ message: "Invalid Token", status: 0 });
  }
};

module.exports = verifyToken;
