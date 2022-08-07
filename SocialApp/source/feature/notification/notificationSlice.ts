import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {showAlert} from '../../ultilities/Ultilities';
import {Notification, NotificationItem} from '../../constant/types';
import callAPI from '../../apis/api';
import {
  getNotificationUrl,
  getUpdateStatusNotificationUrl,
} from '../../apis/url';
import {State} from 'react-native-gesture-handler';

interface NotificationState {
  listNotification: Array<NotificationItem>;
  totalNotification: number;
  totalNotificationNotRead: number;
}

// Define the initial state using that type
const initialState: NotificationState = {
  listNotification: [],
  totalNotification: 0,
  totalNotificationNotRead: 0,
};

export const requestGetListNotification = createAsyncThunk(
  'requestGetListNotification',
  async ({page}: {page: number}): Promise<Partial<Notification>> => {
    try {
      const params = {
        page,
      };
      const res = await callAPI('get', getNotificationUrl(), {}, params);
      return {
        status: res.status,
        listNotification: res.listNotify,
        totalNotification: res.totalNotify,
        totalNotificationNotRead: res.totalNotifyNotRead,
        currentPage: res.currentPage,
      };
    } catch (error) {
      showAlert(error.message, 'danger');
      return {
        status: false,
      };
    }
  },
);

export const requestUpdateStatusNotification = createAsyncThunk(
  'requestUpdateStatusNotification',
  async ({id}: {id: string}): Promise<Partial<Notification>> => {
    try {
      const data = {
        _id: id,
      };
      const res = await callAPI(
        'patch',
        getUpdateStatusNotificationUrl(),
        data,
        {},
      );
      return {
        status: res.status,
      };
    } catch (error) {
      return {
        status: false,
      };
    }
  },
);

export const notificationSlice = createSlice({
  name: 'post',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    resetListNotification: state => {
      state.listNotification = [];
      state.totalNotification = 0;
    },
    updateStatusNotification: (state, action) => {
      const indexOfItem = state.listNotification.findIndex(
        item => item._id === action.payload._id,
      );
      const newItem = {
        ...state.listNotification[indexOfItem],
        isSeen: true,
      };
      state.listNotification.splice(indexOfItem, 1, newItem);
      state.totalNotificationNotRead -= 1;
    },
  },
  extraReducers: builder => {
    builder.addCase(requestGetListNotification.fulfilled, (state, action) => {
      if (action.payload.status) {
        if (action.payload.currentPage === 1) {
          state.listNotification = action.payload.listNotification;
          state.totalNotification = action.payload.totalNotification;
          state.totalNotificationNotRead =
            action.payload.totalNotificationNotRead;
        } else {
          state.listNotification = [
            ...state.listNotification,
            ...action.payload.listNotification,
          ];
        }
      }
    });
  },
});

export const {resetListNotification, updateStatusNotification} =
  notificationSlice.actions;

export default notificationSlice.reducer;
