export interface User {
  status?: boolean;
  id?: string;
  email?: string;
  password?: string;
  name?: string;
  avatar?: string;
  coverImage?: string;
  token?: string;
  listFollow: Array<string>;
  listFollower: Array<string>;
}

export type RootStackParamList = {
  AuthNavigator: undefined;
  MainNavigator: undefined;
  SplashScreen: undefined;
  SignInScreen: undefined;
  SignUpScreen: undefined;
  TopTabs: undefined;
  HomeScreen: undefined;
  CreatePostScreen: undefined;
  MessageScreen: undefined;
  ChatScreen: {
    conversationID?: string;
    userCreatorID?: string;
    participantID?: Array<string>;
    friendAvatar?: string;
    friendName?: string;
  };
  DetailPostScreen: {
    idPost: string;
  };
  ShowFullImageScreen: {
    uriImage: string;
    width: number;
    height: number;
  };
  ProfileScreen: {
    uid: string;
  };
  CommentPostScreen: {
    postID: string;
  };
  NotificationScreen: undefined;
};

export interface PostItem {
  timeCreate: number | string | Date;
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

export interface CommentItem {
  timeCreate: number | string | Date;
  content: string;
  urlImage: string | null;
  user: {
    _id: string;
    avatar: string;
    name: string;
  };
  post: string;
  _id: string;
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
  listComment?: Array<CommentItem>;
  total?: number;
  comment?: CommentItem;
  postID?: string;
}

export interface ListUser {
  status?: Boolean;
  listUser?: Array<UserItem>;
  currentPage?: number;
  totalUser: number;
}

export interface DataUser {
  status?: Boolean;
  listPost?: Array<PostItem>;
  currentPage?: number;
  totalPost: number;
  name: string;
  avatar: string | undefined | null;
  coverImage: string | undefined | null;
  listFollow: Array<string>;
  listFollower: Array<string>;
}

export interface ConversationItem {
  _id: string;
  lastMessage: string;
  userCreator: {
    _id: string;
    name: string;
    avatar: string;
  };
  userSend: string;
  participants: Array<{
    _id: string;
    name: string;
    avatar: string;
  }>;
  timeSend: number;
  isSeen: boolean;
}

export interface Conversation {
  status?: boolean;
  listConversation?: Array<ConversationItem>;
  currentPage?: number;
  total?: number;
  totalNotRead: number;
}

export interface MessageItem {
  timeCreate: number;
  content: string;
  urlImage: string;
  conversation: string;
  userSend: {
    _id: string;
    name: string;
    avatar: string | null;
  };
  participants: Array<{
    _id: string;
    name: string;
    avatar: string | null;
  }>;
  _id: string;
}

export interface MessageParams {
  content: string;
  urlImage: string | null;
  userSend: string;
  conversation: string | null;
  participants: Array<{
    _id: string;
    name: string;
    avatar: string | null;
  }>;
}

export interface Message {
  status?: boolean;
  listMessage?: Array<MessageItem>;
  currentPage?: number;
  total?: number;
  conversationID?: string;
  messageResponse?: MessageItem;
  message?: string;
}

export interface NotificationItem {
  owner: string;
  timeCreate: Date;
  body: string;
  title: string;
  type: string;
  post: string;
  user: {
    _id: string;
    name: string;
    avatar: string;
  };
  isSeen: boolean;
  _id: string;
}

export interface Notification {
  status?: Boolean;
  listNotification?: Array<NotificationItem>;
  currentPage?: number;
  totalNotification?: number;
  totalNotificationNotRead?: number;
}
