import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {showAlert} from '../../ultilities/Ultilities';
import {ListUser, UserItem} from '../../constant/types';
import callAPI from '../../apis/api';
import {getListUserUrl} from '../../apis/url';

interface UserState {
  listUser: Array<UserItem>;
  currentPage: number;
}

export const requestGetUser = createAsyncThunk(
  'user/requestGetUser',
  async ({page}: {page: number}): Promise<Partial<ListUser>> => {
    try {
      const params = {
        page,
      };
      const res = await callAPI('get', getListUserUrl(), {}, params);
      return new Promise(resolve => {
        resolve({
          status: true,
          listUser: res.listUser,
          currentPage: res.current_page,
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
const initialState: UserState = {
  listUser: [],
  currentPage: 1,
};

export const userSlice = createSlice({
  name: 'user',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(requestGetUser.pending, state => {});
    builder.addCase(requestGetUser.fulfilled, (state, action) => {
      if (action.payload.status) {
        state.currentPage = action.payload.currentPage;
        if (action.payload.currentPage === 1) {
          state.listUser = action.payload.listUser;
        } else {
          state.listUser = [...state.listUser, ...action.payload.listUser];
        }
      }
    });
    builder.addCase(requestGetUser.rejected, state => {});
  },
});

export const {} = userSlice.actions;

export default userSlice.reducer;
