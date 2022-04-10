import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {showAlert} from '../../ultilities/Ultilities';
import {ListUser, UserItem} from '../../constant/types';
import callAPI from '../../apis/api';
import {getListUserUrl} from '../../apis/url';

interface UserState {}

export const requestGetUser = createAsyncThunk(
  'user/requestGetUser',
  async ({
    page,
    filter,
  }: {
    page: number;
    filter: string;
  }): Promise<Partial<ListUser>> => {
    try {
      const params = {
        page,
        filter,
      };
      const res = await callAPI('get', getListUserUrl(), {}, params);
      return new Promise(resolve => {
        resolve({
          status: true,
          listUser: res.listUser,
          currentPage: res.current_page,
          totalUser: res.totalUser,
        });
      });
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

// Define the initial state using that type
const initialState: UserState = {};

export const userSlice = createSlice({
  name: 'user',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {},
});

export const {} = userSlice.actions;

export default userSlice.reducer;
