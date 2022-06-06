import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {showAlert} from '../../ultilities/Ultilities';
import {Conversation, ConversationItem} from '../../constant/types';
import callAPI from '../../apis/api';
import {getConversationUrl} from '../../apis/url';
import {store} from '../../app/store';

interface ConversationState {
  listConversation: Array<ConversationItem>;
  currentPage: number;
  totalConversationNotRead: number;
}

export const requestGetConversation = createAsyncThunk(
  'conversation/requestGetConversation',
  async ({page}: {page: Number}): Promise<Partial<Conversation>> => {
    try {
      const params = {
        page,
      };
      const res = await callAPI('get', getConversationUrl(), {}, params);
      const newListConversation = res.listConversation.filter(
        (item: ConversationItem) => item.lastMessage !== '',
      );
      return new Promise(resolve => {
        resolve({
          status: true,
          listConversation: newListConversation,
          currentPage: res.current_page,
          total: res.total,
          totalNotRead: res.totalNotRead,
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
const initialState: ConversationState = {
  listConversation: [],
  currentPage: 1,
  totalConversationNotRead: 0,
};

export const conversationSlice = createSlice({
  name: 'conversation',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    updateConversation: (state, action) => {
      const indexOfNewConversation = state.listConversation.findIndex(
        item => item._id === action.payload.conversation._id,
      );
      if (indexOfNewConversation !== -1) {
        if (state.listConversation[indexOfNewConversation].isSeen) {
          if (action.payload.conversation.userSend !== action.payload.user) {
            state.totalConversationNotRead += 1;
          }
        }
        state.listConversation.splice(indexOfNewConversation, 1);
      } else {
        state.totalConversationNotRead += 1;
      }
      state.listConversation = [
        action.payload.conversation,
        ...state.listConversation,
      ];
    },

    updateStatusConversation: (state, action) => {
      const indexOfConversation = state.listConversation.findIndex(
        item => item._id === action.payload.conversationID,
      );
      if (indexOfConversation !== -1) {
        if (
          state.listConversation[indexOfConversation].userSend !==
          action.payload.userID
        ) {
          const newConversation = state.listConversation;
          newConversation[indexOfConversation] = {
            ...newConversation[indexOfConversation],
            isSeen: true,
          };
          state.listConversation = newConversation;
          if (state.totalConversationNotRead > 0) {
            state.totalConversationNotRead -= 1;
          }
        }
      }
    },
  },
  extraReducers: builder => {
    builder.addCase(requestGetConversation.pending, state => {});
    builder.addCase(requestGetConversation.fulfilled, (state, action) => {
      if (action.payload.status) {
        state.currentPage = action.payload.currentPage;
        if (action.payload.currentPage === 1) {
          state.listConversation = action.payload.listConversation;
          state.totalConversationNotRead = action.payload.totalNotRead;
        } else {
          state.listConversation = [
            ...state.listConversation,
            ...action.payload.listConversation,
          ];
        }
      }
    });
    builder.addCase(requestGetConversation.rejected, state => {});
  },
});

export const {updateConversation, updateStatusConversation} =
  conversationSlice.actions;

export default conversationSlice.reducer;
