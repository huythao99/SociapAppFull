import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {showAlert} from '../../ultilities/Ultilities';
import {
  Conversation,
  Message,
  MessageItem,
  MessageParams,
} from '../../constant/types';
import callAPI from '../../apis/api';
import {getConversationUrl, getMessage, sendMessage} from '../../apis/url';
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
    conversationID,
  }: {
    page: Number;
    participants: Array<string> | null;
    conversationID: string | null;
  }): Promise<Partial<Message>> => {
    try {
      const params = {
        page,
        participants,
        conversationID,
      };
      const res = await callAPI('get', getMessage(), {}, params);
      if (res.status) {
        return new Promise(resolve => {
          resolve({
            status: true,
            listMessage: res.listMessage,
            currentPage: res.current_page,
            total: res.total,
            conversationID: res.conversationID,
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

export const requestSendMessage = createAsyncThunk(
  'message/requestSendMessage',
  async ({message}: {message: MessageParams}): Promise<Partial<Message>> => {
    try {
      const data = {
        message,
      };
      const response = await callAPI('post', sendMessage(), data, {});
      if (response.status) {
        return {
          status: true,
          messageResponse: response.messageResponse,
          message: response.message,
        };
      } else {
        showAlert('Đã có lỗi xảy ra', 'danger');
        return {
          status: false,
          message: 'Đã có lỗi xảy ra',
        };
      }
    } catch (error) {
      showAlert(error.message, 'danger');
      return {
        status: false,
        message: error.message,
      };
    }
  },
);

export const messageSlice = createSlice({
  name: 'message',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    updateListMessage: (state, action) => {
      state.listMessage = [action.payload.message, ...state.listMessage];
    },
    resetListMessage: state => {
      state.listMessage = [];
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

export const {updateListMessage, resetListMessage} = messageSlice.actions;

export default messageSlice.reducer;
