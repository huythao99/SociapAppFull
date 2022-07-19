const express = require("express");
const verifyToken = require("../validation/verifyToken");

require("dotenv").config();
const router = express.Router();

const { getNotify, updateStatusNotify } = require("../controller/notification");

// get list notification
router.get("/", verifyToken, getNotify);

// update status list notification
router.patch("/", verifyToken, updateStatusNotify);
module.exports = router;
