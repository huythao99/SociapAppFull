require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongo = require("mongoose");
var cors = require("cors");
const cloudinary = require("cloudinary");

var authRouter = require("./routes/auth");
var userRouter = require("./routes/user");
var chatRouter = require("./routes/chat");
var notifyRouter = require("./routes/notify");
var postRouter = require("./routes/post");

var mongoString = process.env.DATABASE_URL;

var app = express();

mongo.connect(mongoString);
const database = mongo.connection;
database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("connected database");
});

cloudinary.config({
  cloud_name: "dbhjxaqce",
  api_key: "314688645395247",
  api_secret: "lYTuaa26jmkuTNX4ZSQZDAexyi0",
});
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));

app.use("/api/auth", authRouter);
app.use("/api/chat", chatRouter);
app.use("/api/post", postRouter);
app.use("/api/user", userRouter);
app.use("/api/notify", notifyRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// app.get("/", function (res, req) {
//   res.send("hello world");
// });

module.exports = app;
