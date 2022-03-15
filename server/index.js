require("dotenv").config();
const express = require("express");
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
const { sortID } = require("./ultilities/Ultilities");
app.use(cors());

mongo.connect(mongoString);
const database = mongo.connection;

database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("connected database");
});

app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/post", postRoute);
app.use("/api/user", userRoute);
app.use("/api/chat", chatRoute);

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const socketChat = io.of("/chat");

io.on("connection", (socket) => {});

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

httpServer.listen(3000, () => {
  console.log("running");
});
