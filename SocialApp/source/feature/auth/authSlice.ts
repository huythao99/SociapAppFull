import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../../app/store';
import callAPI from '../../apis/api';
import {showAlert} from '../../ultilities/Ultilities';
import {User} from '../../constant/types';
import {getSignInUrl, getSignUpUrl} from '../../apis/url';
import {ActionSheetIOS} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAppDispatch} from '../../app/hook';

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
};

export const requestSignin = createAsyncThunk(
  'auth/requestSignin',
  async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<Partial<User>> => {
    try {
      const data = {
        email,
        password,
      };
      const res = await callAPI('post', `${getSignInUrl()}`, data, {});
      if (res.status === 1) {
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
    }: {
      name: string;
      email: string;
      password: string;
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
      if (res.status === 1) {
        await AsyncStorage.setItem('user', JSON.stringify(res));
        showAlert('Tạo tài khoản thành công', 'success');
        thunkAPI.dispatch(
          requestSignin({email: res.email, password: res.password}),
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

export const authSlice = createSlice({
  name: 'auth',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    loadingSplash: state => {
      state.isLoadingSplash = false;
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
      }
    });
    builder.addCase(requestSignin.rejected, state => {});
    // sign up
  },
});

export const {loadingSplash} = authSlice.actions;

export default authSlice.reducer;
