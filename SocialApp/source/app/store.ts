import {configureStore} from '@reduxjs/toolkit';
import authReducer from '../feature/auth/authSlice';
import postReducer from '../feature/post/postSlice';
import userReducer from '../feature/user/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    post: postReducer,
    user: userReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
