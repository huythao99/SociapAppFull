const User = require("../models/User");

const getAllFCMTokenUser = async (userID) => {
  const listFCMToken = await User.find({ _id: { $ne: userID } }).select(
    "fcmToken"
  );
  const newListFCMToken = listFCMToken.map((item) => {
    return item.fcmToken;
  });
  return newListFCMToken || [];
};

module.exports = { getAllFCMTokenUser };
