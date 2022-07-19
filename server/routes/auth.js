const express = require("express");
const verifyToken = require("../validation/verifyToken");
const router = express.Router();

const { signin, signup, signout } = require("../controller/user");

signin;
router.post("/signin", signin);

// signup
router.post("/signup", signup);

// sign out
router.get("/signout", verifyToken, signout);

module.exports = router;
