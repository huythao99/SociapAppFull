import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../../app/store';
import callAPI from '../../apis/api';
import {showAlert} from '../../ultilities/Ultilities';
import {User} from '../../constant/types';
import {getSignInUrl, getSignOutUrl, getSignUpUrl} from '../../apis/url';
import {ActionSheetIOS} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define a type for the slice state
interface AuthState {
  email: string;
  password: string;
  name: string;
  avatar: string;
  token: string;
  id: string;
  coverImage: string;
  isLoadingSplash: boolean;
  existUser: boolean;
}

// Define the initial state using that type
const initialState: AuthState = {
  email: '',
  password: '',
  name: '',
  avatar: '',
  id: '',
  token: '',
  coverImage: '',
  isLoadingSplash: true,
  existUser: false,
};

export const requestSignin = createAsyncThunk(
  'auth/requestSignin',
  async ({
    email,
    password,
    fcmtoken,
  }: {
    email: string;
    password: string;
    fcmtoken: string;
  }): Promise<Partial<User>> => {
    try {
      const data = {
        email,
        password,
        fcmtoken,
      };
      const res = await callAPI('post', `${getSignInUrl()}`, data, {});
      if (res?.status === 1) {
        console.log(res);
        await AsyncStorage.setItem('user', JSON.stringify(res));
        return new Promise(resolve => {
          resolve({
            status: true,
            ...res,
          });
        });
      } else {
        return new Promise(resolve => {
          resolve({
            status: false,
            ...res,
          });
        });
      }
    } catch (error) {
      showAlert(error.message, 'danger');
      return new Promise(resolve => {
        resolve({
          status: false,
        });
      });
    }
  },
);

export const requestSignUp = createAsyncThunk(
  'auth/requestSignUp',
  async (
    {
      name,
      email,
      password,
      fcmtoken,
    }: {
      name: string;
      email: string;
      password: string;
      fcmtoken: string;
    },
    thunkAPI,
  ): Promise<Partial<User>> => {
    try {
      const data = {
        name,
        email,
        password,
      };
      const res = await callAPI('post', `${getSignUpUrl()}`, data, {});
      if (res?.status === 1) {
        await AsyncStorage.setItem('user', JSON.stringify(res.user));
        showAlert('Tạo tài khoản thành công', 'success');
        thunkAPI.dispatch(
          requestSignin({
            email: res.user.email,
            password: res.user.password,
            fcmtoken: fcmtoken,
          }),
        );
        return new Promise(resolve => {
          resolve({
            status: true,
          });
        });
      } else {
        return new Promise(resolve => {
          showAlert(res.message, 'warning');
          resolve({
            status: false,
            ...res,
          });
        });
      }
    } catch (error) {
      showAlert(error.message, 'danger');
      return new Promise(resolve => {
        resolve({
          status: false,
        });
      });
    }
  },
);

export const requestSignout = createAsyncThunk(
  'requestSignOut',
  async (): Promise<Partial<User>> => {
    try {
      const res = await callAPI('get', getSignOutUrl(), {}, {});
      if (!res) {
        showAlert('Đã có lỗi xảy ra', 'danger');
        return new Promise(resolve => {
          resolve({
            status: false,
          });
        });
      } else {
        await AsyncStorage.removeItem('user');
        return new Promise(resolve => {
          resolve({
            status: true,
          });
        });
      }
    } catch (error) {
      showAlert(error.message, 'danger');
      return new Promise(resolve => {
        resolve({
          status: false,
        });
      });
    }
  },
);

export const authSlice = createSlice({
  name: 'auth',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    loadingSplash: state => {
      state.isLoadingSplash = false;
    },
    updateAvatar: (state, action) => {
      state.avatar = action.payload.avatar;
    },
    updateCoverImage: (state, action) => {
      state.coverImage = action.payload.coverImage;
    },
  },
  extraReducers: builder => {
    // sign in
    builder.addCase(requestSignin.pending, state => {});
    builder.addCase(requestSignin.fulfilled, (state, action) => {
      if (action.payload.status) {
        state.name = action.payload.name;
        state.email = action.payload.email;
        state.avatar = action.payload.avatar;
        state.password = action.payload.password;
        state.id = action.payload.id;
        state.token = action.payload.token;
        state.coverImage = action.payload.coverImage;
        state.isLoadingSplash = false;
        state.existUser = true;
      } else {
        state.isLoadingSplash = false;
      }
    });
    builder.addCase(requestSignin.rejected, state => {});
    // sign out
    builder.addCase(requestSignout.pending, () => {});
    builder.addCase(requestSignout.fulfilled, (state, action) => {
      if (action.payload.status) {
        state.email = '';
        state.password = '';
        state.name = '';
        state.avatar = '';
        state.id = '';
        state.token = '';
        state.coverImage = '';
        state.isLoadingSplash = false;
        state.existUser = false;
      }
    });
    builder.addCase(requestSignout.rejected, () => {});
  },
});

export const {loadingSplash, updateAvatar, updateCoverImage} =
  authSlice.actions;

export default authSlice.reducer;
