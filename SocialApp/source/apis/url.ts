// auth
export const getSignInUrl = () => {
  return '/api/auth/signin';
};

export const getSignUpUrl = () => {
  return '/api/auth/signup';
};

export const getSignOutUrl = () => {
  return '/api/auth/signout';
};

// post

export const getAllPost = () => {
  return '/api/post/getAllPost';
};

export const getCreatePostUrl = () => {
  return '/api/post/createPost';
};

export const getListPostUrl = () => {
  return '/api/post/getAllPost';
};

export const likePost = () => {
  return '/api/post/likePost';
};

export const getComment = () => {
  return '/api/post/comment';
};

export const getCreateCommentUrl = () => {
  return 'api/post/createComment';
};

// user
export const getListUserUrl = () => {
  return '/api/user/getAllUser';
};

export const getDataUserUrl = () => {
  return '/api/user/getDataUser';
};

export const getUpdateAvatarUserUrl = () => {
  return '/api/user/updateAvatar';
};

export const getUpdateCoverImageUserUrl = () => {
  return '/api/user/updateCoverImage';
};

// chat
export const getConversationUrl = () => {
  return '/api/chat/getConversation';
};

export const getMessage = () => {
  return '/api/chat/getAllMessage';
};

export const sendMessage = () => {
  return '/api/chat/sendMessage';
};
