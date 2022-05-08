var admin = require("firebase-admin");

var serviceAccount = require("../socialapp-e4586-firebase-adminsdk-mqkwk-0716cb3ce2.json");
const User = require("../models/User");
const Notification = require("../models/Notification");

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

const sendNotifiOfFollow = async (userID, followerID) => {
  const follower = await User.findById(followerID);
  const user = await User.findById({ _id: userID });
  admin.messaging().sendToDevice(user.fcmToken, {
    data: {
      user: JSON.stringify({
        name: follower.name,
        _id: follower._id,
        avatar: follower.avatar,
      }),
      type: "FOLLOW",
    },
    notification: {
      body: `${follower.name} đã theo dõi bạn`,
      title: "Đã có người theo dõi bạn trên SocialApp",
      sound: "default",
      color: "#fff566",
      priority: "high",
    },
  });
  const newNotification = new Notification({
    owner: userID,
    body: `${follower.name} đã theo dõi bạn`,
    title: "Đã có người theo dõi bạn trên SocialApp",
    type: "FOLLOW",
    user: followerID,
  });
  await newNotification.save();
};

module.exports = { sendNotifiOfNewPost, sendNotifiOfFollow };
