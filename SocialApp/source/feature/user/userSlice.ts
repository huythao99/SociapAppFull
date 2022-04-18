import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {showAlert} from '../../ultilities/Ultilities';
import {DataUser, ImageFile, ListUser, UserItem} from '../../constant/types';
import callAPI from '../../apis/api';
import {
  getDataUserUrl,
  getListUserUrl,
  getUpdateAvatarUserUrl,
  getUpdateCoverImageUserUrl,
} from '../../apis/url';

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

export const requestGetDataUser = createAsyncThunk(
  'user/requestGetDataUser',
  async ({
    page,
    uid,
  }: {
    page: number;
    uid: string;
  }): Promise<Partial<DataUser>> => {
    try {
      const params = {
        page,
        uid,
      };
      const res = await callAPI('get', getDataUserUrl(), {}, params);
      return new Promise(resolve => {
        resolve({
          status: true,
          listPost: res.dataUser.listPost,
          currentPage: res.current_page,
          totalPost: res.dataUser.totalPost,
          name: res.dataUser.name,
          avatar: res.dataUser.avatar,
          coverImage: res.dataUser.coverImage,
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

export const requestUpdateAvatarUser = createAsyncThunk(
  'user/requestUpdateAvatarUser',
  async ({image}: {image: ImageFile}): Promise<Partial<DataUser>> => {
    try {
      let formData = new FormData();
      formData.append(
        'file',
        JSON.parse(
          JSON.stringify({
            name: `${Date.now()}_${image.fileName}`,
            uri: image.uri,
            type: image.type,
          }),
        ),
      );
      const res = await callAPI(
        'patch',
        getUpdateAvatarUserUrl(),
        formData,
        {},
      );
      return new Promise(resolve => {
        resolve({
          status: true,
          avatar: res.avatar,
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

export const requestUpdateCoverImageUser = createAsyncThunk(
  'user/requestUpdateCoverImageUser',
  async ({image}: {image: ImageFile}): Promise<Partial<DataUser>> => {
    try {
      let formData = new FormData();
      formData.append(
        'file',
        JSON.parse(
          JSON.stringify({
            name: `${Date.now()}_${image.fileName}`,
            uri: image.uri,
            type: image.type,
          }),
        ),
      );
      const res = await callAPI(
        'patch',
        getUpdateCoverImageUserUrl(),
        formData,
        {},
      );
      return new Promise(resolve => {
        resolve({
          status: true,
          coverImage: res.coverImage,
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
