import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {RootState} from '../../app/store';
import callAPI from '../../apis/api';
import {showAlert} from '../../ultilities/Ultilities';
import {User} from '../../constant/types';

// Define a type for the slice state
interface AuthState {
  email: string;
  password: string;
  name: string;
  avatar: string;
  token: string;
  id: string;
}

// Define the initial state using that type
const initialState: AuthState = {
  email: '',
  password: '',
  name: '',
  avatar: '',
  id: '',
  token: '',
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
      const res = await callAPI('post', '/api/auth/signin', data, {});
      return new Promise(resolve => {
        resolve({
          status: true,
        });
      });
    } catch (error) {
      showAlert(error.message, 'danger');
      return new Promise(resolve => {
        resolve({
          status: true,
        });
      });
    }
  },
);

export const authSlice = createSlice({
  name: 'auth',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {},
});

export const {} = authSlice.actions;

export default authSlice.reducer;
