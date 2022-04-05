const express = require("express");
const verifyToken = require("../validation/verifyToken");

require("dotenv").config();
const authRoute = express.Router();

const { signIn, signUp, signOut } = require("../controller/user");

// signin
authRoute.post("/signin", signIn);

// signup
authRoute.post("/signup", signUp);

// sign out
authRoute.get("/signout", verifyToken, signOut);

module.exports = authRoute;
