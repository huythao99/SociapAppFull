import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {showAlert} from '../../ultilities/Ultilities';
import {Post, PostItem} from '../../constant/types';
import storage from '@react-native-firebase/storage';
import callAPI from '../../apis/api';
import {getAllPost, getCreatePostUrl, likePost} from '../../apis/url';

interface PostState {
  listPost: Array<PostItem>;
  currentPage: number;
}

export const requestCreatePost = createAsyncThunk(
  'post/requestCreatePost',
  async ({
    content,
    uriImage,
  }: {
    content: string;
    uriImage: string | null;
    uriVideo: string | null;
  }): Promise<Partial<Post>> => {
    try {
      const timeNow = Date.now();
      let urlImage = null;
      if (uriImage) {
        const reference = storage().ref(`post/${timeNow}_${uriImage}`);
        await reference.putFile(uriImage);
        urlImage = await reference.getDownloadURL();
      }
      const data = {
        content,
        uriImage: urlImage,
      };
      const res = await callAPI('post', getCreatePostUrl(), data, {});
      if (res) {
        showAlert('Đăng bài thành công', 'success');
        return new Promise(resolve => {
          resolve({
            status: true,
            post: res.post,
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

export const requestGetPost = createAsyncThunk(
  'post/requestGetPost',
  async ({page}: {page: number}): Promise<Partial<Post>> => {
    try {
      const params = {
        page,
      };
      const res = await callAPI('get', getAllPost(), {}, params);
      if (res) {
        return new Promise(resolve => {
          resolve({
            status: true,
            listPost: res.listPost,
            currentPage: res.current_page,
          });
        });
      } else {
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

export const requestLikePost = createAsyncThunk(
  'post/requestLikePost',
  async ({postID}: {postID: string}): Promise<Partial<Post>> => {
    try {
      const params = {
        postID,
      };
      const res = await callAPI('patch', likePost(), {}, params);
      if (res) {
        return new Promise(resolve => {
          resolve({
            status: true,
          });
        });
      } else {
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
const initialState: PostState = {
  listPost: [],
  currentPage: 1,
};

export const postSlice = createSlice({
  name: 'post',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    updateListPost: (state, action) => {
      const listPostCoppy = [...state.listPost];
      const indexOfPost = listPostCoppy.findIndex(
        item => item._id === action.payload.post.id,
      );
      if (indexOfPost === -1) {
        state.listPost = [...listPostCoppy, action.payload.post];
      } else {
        state.listPost = listPostCoppy.splice(
          indexOfPost,
          1,
          action.payload.post,
        );
      }
    },
  },
  extraReducers: builder => {
    builder.addCase(requestCreatePost.pending, state => {});
    builder.addCase(requestCreatePost.fulfilled, state => {});
    builder.addCase(requestCreatePost.rejected, state => {});
    // get post
    builder.addCase(requestGetPost.pending, () => {});
    builder.addCase(requestGetPost.fulfilled, (state, action) => {
      if (action.payload.status) {
        if (action.payload.currentPage === 1) {
          state.listPost = action.payload.listPost;
        } else {
          state.listPost = [...state.listPost, ...action.payload.listPost];
        }
        state.currentPage = action.payload.currentPage;
      }
    });
    builder.addCase(requestGetPost.rejected, () => {});
  },
});

export const {updateListPost} = postSlice.actions;

export default postSlice.reducer;
