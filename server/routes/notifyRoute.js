const express = require("express");
const verifyToken = require("../validation/verifyToken");

require("dotenv").config();
const notifyRoute = express.Router();

const { getNotify, updateStatusNotify } = require("../controller/notification");

// get list notification
notifyRoute.get("/getNotify", verifyToken, getNotify);

// update status list notification
notifyRoute.patch("/updateStatusNotify", verifyToken, updateStatusNotify);
module.exports = notifyRoute;
