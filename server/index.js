require("dotenv").config();
const express = require("express");
const cloudinary = require("cloudinary");
const authRoute = require("./routes/authRoute");
const postRoute = require("./routes/postRoute");
const userRoute = require("./routes/userRoute");

const app = express();
const mongo = require("mongoose");
const mongoString = process.env.DATABASE_URL;
const { createServer } = require("http");
const { Server } = require("socket.io");

var cors = require("cors");
const chatRoute = require("./routes/chatRoute");
const { createMessage, updateConversation } = require("./controller/chat");
const { getPostByID, getCommentByID } = require("./controller/post");
const { getAllFCMTokenUser } = require("./controller/user");
const { sendNotifiOfNewPost } = require("./controller/notification");
app.use(cors());

mongo.connect(mongoString);
const database = mongo.connection;

const PORT = process.env.PORT || 3000;

database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("connected database");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoute);
app.use("/api/post", postRoute);
app.use("/api/user", userRoute);
app.use("/api/chat", chatRoute);

cloudinary.config({
  cloud_name: "dbhjxaqce",
  api_key: "314688645395247",
  api_secret: "lYTuaa26jmkuTNX4ZSQZDAexyi0",
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "https://my-social-app-server.herokuapp.com",
    methods: ["GET", "POST"],
  },
});

const socketChat = io.of("/chat");

io.on("connection", (socket) => {
  socket.on("createPost", async (post) => {
    const response = await getPostByID(post._id);
    socket.emit("updatePost", response);
    // const listFCMToken = await getAllFCMTokenUser(post.creater);
    // sendNotifiOfNewPost(listFCMToken, post.creater, post._id);
  });

  socket.on("createComment", async (comment) => {
    const response = await getCommentByID(comment._id);
    socket.emit("updateComment", response);
    // const listFCMToken = await getAllFCMTokenUser(post.creater);
    // sendNotifiOfNewPost(listFCMToken, post.creater, post._id);
  });
});

socketChat.on("connection", (socket) => {
  socket.on("join room", (roomID) => {
    socket.join(roomID);
  });
  socket.on("sendMessage", async (roomID, message) => {
    createMessage(message);
    socket.to(roomID).emit("receiverMessage", message);
  });
  socket.on("leave room", async (roomID) => {
    const data = await updateConversation(roomID);
    socket.emit("updateConversation", data);
    socket.leave(roomID);
  });
});

httpServer.listen(PORT, (req, res) => {
  console.log("running");
});
