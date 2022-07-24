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
  return '/api/post/';
};

export const getDetailPost = () => {
  return '/api/post/detail';
};

export const getCreatePostUrl = () => {
  return '/api/post/';
};

export const likePost = () => {
  return '/api/post/like';
};

export const getComment = () => {
  return '/api/post/comment';
};

export const getCreateCommentUrl = () => {
  return 'api/post/comment';
};

export const getEditPostUrl = () => {
  return 'api/post/edit';
};

export const getReportPostUrl = () => {
  return 'api/post/report';
};

// user
export const getListUserUrl = () => {
  return '/api/user/';
};

export const getDataUserUrl = () => {
  return '/api/user/profile';
};

export const getUpdateAvatarUserUrl = () => {
  return '/api/user/profile/avatar';
};

export const getUpdateCoverImageUserUrl = () => {
  return '/api/user/profile/cover-image';
};

export const getFollowUserUrl = () => {
  return '/api/user/follow';
};

// chat
export const getConversationUrl = () => {
  return '/api/chat/conversation';
};

export const getMessage = () => {
  return '/api/chat/message';
};

export const sendMessage = () => {
  return '/api/chat/message';
};

// notification
export const getNotificationUrl = () => {
  return '/api/notify/';
};

export const getUpdateStatusNotificationUrl = () => {
  return '/api/notify/';
};
