import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {showAlert} from '../../ultilities/Ultilities';
import {ImageFile, Post, PostItem} from '../../constant/types';
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
    image,
  }: {
    content: string;
    image: ImageFile | null;
    uriVideo: string | null;
  }): Promise<Partial<Post>> => {
    try {
      let formData = new FormData();
      formData.append('content', content);
      if (image) {
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
      }
      const res = await callAPI(
        'post',
        getCreatePostUrl(),
        formData,
        {},
        'multipart/form-data',
      );
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
});

export const {updateListPost} = postSlice.actions;

export default postSlice.reducer;
