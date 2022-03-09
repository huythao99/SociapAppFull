require("dotenv").config();
const express = require("express");
const authRoute = require("./routes/authRoute");
const postRoute = require("./routes/postRoute");
const userRoute = require("./routes/userRoute");

const app = express();
const mongo = require("mongoose");
const mongoString = process.env.DATABASE_URL;

var cors = require("cors");
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

app.listen(3000, () => {
  console.log("running");
});
