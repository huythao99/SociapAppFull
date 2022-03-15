export interface User {
  status?: Boolean;
  id?: string;
  email?: string;
  password?: string;
  name?: string;
  avatar?: string;
  coverImage?: string;
  token?: string;
}

export type RootStackParamList = {
  SplashScreen: undefined;
  SignInScreen: undefined;
  SignUpScreen: undefined;
  TopTabs: undefined;
  HomeScreen: undefined;
  CreatePostScreen: undefined;
  MessageScreen: undefined;
  ChatScreen: {
    friendID: string;
    friendAvatar: string;
    friendName: string;
  };
};

interface UserLike {
  userID: string;
  userName: string;
  userAvatar: string | null;
}

export interface PostItem {
  timeCreate: number;
  id: string;
  userId: string;
  userAvatar: string;
  userName: string;
  content: string;
  uriImage: string | null;
  uriVideo: string | null;
  numOfLike: number;
  numOfShare: number;
  numOfComment: number;
  listUserLike: Array<UserLike>;
}

export interface UserItem {
  name: string;
  avatar: string;
  id: string;
}

export interface Post {
  status?: Boolean;
  listPost?: Array<PostItem>;
  currentPage?: number;
}

export interface ListUser {
  status?: Boolean;
  listUser?: Array<UserItem>;
  currentPage?: number;
}

export interface ConversationItem {
  _id: string;
  content: string;
  senderID: {
    _id: string;
    name: string;
    avatar: string;
  };
  receiverID: {
    _id: string;
    name: string;
    avatar: string;
  };
  timeSend: number;
  message?: Array<string>;
}

export interface Conversation {
  status: Boolean;
  listConversation: Array<ConversationItem>;
  currentPage: Number;
}

export interface MessageItem {
  timeCreate: Number;
  content: string;
  urlImage: string;
  senderID: string;
  receiverID: {
    _id: string;
    name: string;
    avatar: string;
  };
}

export interface Message {
  status: Boolean;
  listMessage: Array<MessageItem>;
  currentPage: Number;
}
