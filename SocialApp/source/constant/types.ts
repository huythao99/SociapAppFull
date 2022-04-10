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
  DetailPostScreen: {
    idPost: string;
  };
  ShowFullImageScreen: {
    uriImage: string;
    width: number;
    height: number;
  };
};

export interface PostItem {
  timeCreate: number;
  _id?: string;
  creater: {
    _id: string;
    avatar: string;
    name: string;
  };
  content: string;
  uriImage: string | null;
  uriVideo: string | null;
  listUserLike: Array<string>;
  listComment: Array<string>;
}

export interface ImageFile {
  type: string;
  fileName: string;
  uri: string;
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
  post?: PostItem;
}

export interface ListUser {
  status?: Boolean;
  listUser?: Array<UserItem>;
  currentPage?: number;
  totalUser: number;
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
  _id: string;
}

export interface Message {
  status: Boolean;
  listMessage: Array<MessageItem>;
  currentPage: Number;
}
