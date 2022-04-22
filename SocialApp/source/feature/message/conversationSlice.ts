import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {showAlert} from '../../ultilities/Ultilities';
import {Conversation, ConversationItem} from '../../constant/types';
import callAPI from '../../apis/api';
import {getConversationUrl} from '../../apis/url';

interface ConversationState {
  listConversation: Array<ConversationItem>;
  currentPage: Number;
}

export const requestGetConversation = createAsyncThunk(
  'get/requestGetConversation',
  async ({page}: {page: Number}): Promise<Partial<Conversation>> => {
    try {
      const params = {
        page,
      };
      const res = await callAPI('get', getConversationUrl(), {}, params);
      return new Promise(resolve => {
        resolve({
          status: true,
          listConversation: res.listConversation,
          currentPage: res.current_page,
          total: res.total,
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
};

export const conversationSlice = createSlice({
  name: 'conversation',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    updateConversation: (state, action) => {
      const listConversationCoppy = state.listConversation;
      const indexOfNewConversation = state.listConversation.findIndex(
        item => item._id === action.payload.conversation._id,
      );
      if (indexOfNewConversation === -1) {
        listConversationCoppy.push(action.payload);
      } else {
        listConversationCoppy.splice(
          indexOfNewConversation,
          1,
          action.payload.conversation,
        );
      }
      listConversationCoppy.sort((a, b) => a.timeSend - b.timeSend);
      state.listConversation = listConversationCoppy;
    },
  },
  extraReducers: builder => {
    builder.addCase(requestGetConversation.pending, state => {});
    builder.addCase(requestGetConversation.fulfilled, (state, action) => {
      if (action.payload.status) {
        state.currentPage = action.payload.currentPage;
        if (action.payload.currentPage === 1) {
          state.listConversation = action.payload.listConversation;
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

export const {updateConversation} = conversationSlice.actions;

export default conversationSlice.reducer;
