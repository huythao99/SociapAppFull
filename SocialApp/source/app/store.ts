import {configureStore} from '@reduxjs/toolkit';
import authReducer from '../feature/auth/authSlice';
import postReducer from '../feature/post/postSlice';
import userReducer from '../feature/user/userSlice';
import conversationReducer from '../feature/message/conversationSlice';
import messageReducer from '../feature/message/messageSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    post: postReducer,
    user: userReducer,
    conversation: conversationReducer,
    message: messageReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
