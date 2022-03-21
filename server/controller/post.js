const Post = require("../models/Post");

const getPostByID = async (idPost) => {
  const post = await Post.findById({ _id: idPost }).populate({
    path: "userId",
    select: "name _id avatar",
  });
  return post;
};

module.exports = { getPostByID };
