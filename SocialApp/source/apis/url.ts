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

// user
export const getListUserUrl = () => {
  return '/api/user/getAllUser';
};

// chat
export const getConversationUrl = () => {
  return '/api/chat/getConversation';
};

export const getMessage = () => {
  return '/api/chat/getAllMessage';
};
