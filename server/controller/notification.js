var admin = require("firebase-admin");

var serviceAccount = require("../socialapp-e4586-firebase-adminsdk-mqkwk-0716cb3ce2.json");
const User = require("../models/User");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const sendNotifiOfNewPost = async (listFCMToken, userID, postID) => {
  const user = await User.findById({ _id: userID });
  if (!user || listFCMToken.length === 0) {
    return;
  }
  admin.messaging().sendMulticast({
    tokens: listFCMToken,
    notification: {
      body: "This is an FCM notification that displays an image!",
      title: "FCM Notification",
    },
    data: {},
    android: {
      notification: {
        body: `${user.name} đã thêm một bài viết vào trang cá nhân`,
        title: "Thông báo",
        sound: "default",
        color: "#fff566",
        priority: "high",
      },
    },
  });
};

module.exports = { sendNotifiOfNewPost };
