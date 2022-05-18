var admin = require("firebase-admin");

var serviceAccount = require("../socialapp-e4586-firebase-adminsdk-mqkwk-0716cb3ce2.json");
const User = require("../models/User");
const Notification = require("../models/Notification");
const Post = require("../models/Post");
const { ITEMS_IN_PAGE } = require("../constants");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const getNotify = async (req, res) => {
  try {
    const currentPage = Number(req.query.page || 1);
    const notify = await Notification.find({
      owner: req.user._id,
    })
      .populate({
        path: "user",
        select: "_id name avatar",
      })
      .sort({ timeCreate: -1 })
      .skip((currentPage - 1) * ITEMS_IN_PAGE)
      .limit(ITEMS_IN_PAGE);
    const totalNotify = await Notification.countDocuments({
      owner: req.user._id,
    });
    const totalNotifyNotRead = await Notification.countDocuments({
      $and: [
        { owner: req.user._id },
        {
          isSeen: {
            $ne: true,
          },
        },
      ],
    });

    return res.status(200).json({
      message: "get list notification success",
      status: 1,
      listNotify: notify,
      totalNotify,
      totalNotifyNotRead,
      currentPage,
    });
  } catch (error) {
    res.status(400).json({
      status: 0,
      message: error.message,
    });
  }
};

const updateStatusNotify = async (req, res) => {
  try {
    const options = {
      new: true,
    };
    await Notification.findByIdAndUpdate(
      { _id: req.body._id },
      {
        isSeen: true,
      },
      options
    );
    return res.status(200).json({
      status: 1,
      message: "update success",
    });
  } catch (error) {
    return res.status(400).json({
      status: 0,
      message: error.message,
    });
  }
};

const sendNotifiOfNewPost = async (userID, postID) => {
  const user = await User.findById({ _id: userID }).populate({
    path: "listFollower",
    select: "fcmToken",
  });
  const listFCMToken = user.listFollower.map((item) => {
    return item.fcmToken;
  });
  admin.messaging().sendMulticast({
    tokens: listFCMToken,
    notification: {
      body: `${user.name} đã thêm một bài viết mới`,
      title: "SocialApp thông báo",
    },
    data: {
      post: JSON.stringify({ postID }),
      type: "CREATE_POST",
    },
  });
  const newNotification = new Notification({
    owner: userID,
    body: `${user.name} đã thêm một bài viết mới`,
    title: "SocialApp thông báo",
    type: "CREATE_POST",
    post: postID,
  });
  await newNotification.save();
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

const sendNotificationOfComment = async (userID, postID) => {
  const user = await User.findById({ _id: userID });
  const post = await Post.findById({ _id: postID })
    .populate({
      path: "creater",
      select: "fcmToken",
    })
    .populate({
      path: "listComment",
      populate: {
        path: "user",
        select: "fcmToken",
      },
    });
  const listUserComment = post.listComment.filter(
    (item) =>
      !(
        item.user?._id?.equals(user._id) ||
        item.user?._id?.equals(post.creater._id)
      )
  );
  const listFCMToken = listUserComment.map((item) => {
    return item.user.fcmToken;
  });
  const listUser = listUserComment.map((item) => {
    return item.user._id;
  });
  if (!user._id.equals(post.creater._id)) {
    admin.messaging().sendToDevice(post.creater.fcmToken, {
      data: {
        user: JSON.stringify({
          name: user.name,
          _id: user._id,
          avatar: user.avatar,
        }),
        post: JSON.stringify({ postID }),
        type: "COMMENT",
      },
      notification: {
        body: `${user.name} đã bình luận về bài một viết của bạn`,
        title: "SocialApp thông báo",
      },
    });
  }
  if (listFCMToken.length > 0) {
    admin.messaging().sendMulticast({
      tokens: listFCMToken,
      notification: {
        body: `${user.name} đã bình luận về một bài viết mà bạn theo dõi`,
        title: "SocialApp thông báo",
      },
      data: {
        post: JSON.stringify({ postID }),
        user: JSON.stringify({
          name: user.name,
          _id: user._id,
          avatar: user.avatar,
        }),
        type: "COMMENT",
      },
    });
  }
  const newNotification = new Notification({
    owner: post.creater._id,
    body: `${user.name} đã bình luận về bài một viết của bạn`,
    title: "SocialApp thông báo",
    type: "COMMENT",
    user: user._id,
    post: postID,
  });
  const newListNotification = listUser.map((item) => {
    return {
      owner: item,
      body: `${user.name} đã bình luận về bài một viết của bạn`,
      title: "SocialApp thông báo",
      type: "COMMENT",
      user: user._id,
      post: postID,
    };
  });
  if (user._id !== post.creater._id) {
    newListNotification.push(newNotification);
  }
  await Notification.insertMany([...newListNotification]);
};

module.exports = {
  sendNotifiOfNewPost,
  sendNotifiOfFollow,
  sendNotificationOfComment,
  getNotify,
  updateStatusNotify,
};
