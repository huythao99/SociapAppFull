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
