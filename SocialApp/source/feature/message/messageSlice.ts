import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {showAlert} from '../../ultilities/Ultilities';
import {Conversation, Message, MessageItem} from '../../constant/types';
import callAPI from '../../apis/api';
import {getConversationUrl, getMessage} from '../../apis/url';
import {showMessage} from 'react-native-flash-message';

interface MessageState {
  listMessage: Array<MessageItem>;
  currentPage: Number;
}

export const requestGetMessage = createAsyncThunk(
  'get/requestGetMessage',
  async ({
    page,
    participants,
  }: {
    page: Number;
    participants: Array<string>;
  }): Promise<Partial<Message>> => {
    try {
      const params = {
        page,
        participants,
      };
      const res = await callAPI('get', getMessage(), {}, params);
      console.log(res);
      if (res.status) {
        return new Promise(resolve => {
          resolve({
            status: true,
            listMessage: res.listMessage,
            currentPage: res.current_page,
            total: res.total,
          });
        });
      } else {
        showAlert(res.message, 'danger');
        return new Promise(resolve => {
          resolve({
            status: false,
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

// Define the initial state using that type
const initialState: MessageState = {
  listMessage: [],
  currentPage: 1,
};

export const messageSlice = createSlice({
  name: 'message',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    updateListMessage: (state, action) => {
      state.listMessage = [action.payload, ...state.listMessage];
    },
  },
  extraReducers: builder => {
    builder.addCase(requestGetMessage.pending, state => {});
    builder.addCase(requestGetMessage.fulfilled, (state, action) => {
      if (action.payload.status) {
        state.currentPage = action.payload.currentPage;
        if (action.payload.currentPage === 1) {
          state.listMessage = action.payload.listMessage;
        } else {
          state.listMessage = [
            ...state.listMessage,
            ...action.payload.listMessage,
          ];
        }
      }
    });
    builder.addCase(requestGetMessage.rejected, state => {});
  },
});

export const {updateListMessage} = messageSlice.actions;

export default messageSlice.reducer;
