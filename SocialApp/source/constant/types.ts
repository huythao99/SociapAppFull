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
}

export interface ListUser {
  status?: Boolean;
  listUser?: Array<UserItem>;
  currentPage?: number;
}
