import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {showAlert} from '../../ultilities/Ultilities';
import {CommentItem, ImageFile, Post, PostItem} from '../../constant/types';
import callAPI from '../../apis/api';
import {
  getAllPost,
  getComment,
  getCreateCommentUrl,
  getCreatePostUrl,
  getDetailPost,
  getEditPostUrl,
  getReportPostUrl,
  likePost,
} from '../../apis/url';

interface PostState {
  listPost: Array<PostItem>;
  listComment: Array<CommentItem>;
  postID: string;
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

export const requestGetDetailPost = createAsyncThunk(
  'post/requestGetDetailPost',
  async ({postId}: {postId: string}): Promise<Partial<Post>> => {
    try {
      const data = {
        postId,
      };
      const res = await callAPI('get', getDetailPost(), {}, data);
      if (res) {
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
  async ({skip}: {skip: number}): Promise<Partial<Post>> => {
    try {
      const params = {
        skip,
      };
      const res = await callAPI('get', getAllPost(), {}, params);
      if (res) {
        return new Promise(resolve => {
          resolve({
            status: true,
            listPost: res.listPost,
            total: res.total,
            skip: skip,
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

export const requestGetComment = createAsyncThunk(
  'post/requestGetComment',
  async ({
    page,
    postID,
  }: {
    page: number;
    postID: string;
  }): Promise<Partial<Post>> => {
    try {
      const params = {
        page,
        postID,
      };
      const res = await callAPI('get', getComment(), {}, params);
      if (res) {
        return new Promise(resolve => {
          resolve({
            status: true,
            listComment: res.listComment,
            currentPage: res.current_page,
            total: res.total,
            postID: postID,
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

export const requestCreateComment = createAsyncThunk(
  'post/requestCreateComment',
  async ({
    content,
    postID,
    image,
  }: {
    content: string;
    image: ImageFile | null;
    postID: string;
  }): Promise<Partial<Post>> => {
    try {
      let formData = new FormData();
      formData.append('content', content);
      formData.append('postID', postID);
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
        getCreateCommentUrl(),
        formData,
        {},
        'multipart/form-data',
      );
      if (res) {
        return new Promise(resolve => {
          resolve({
            status: true,
            comment: res.comment,
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

export const requestEditPost = createAsyncThunk(
  'post/requestEditPost',
  async ({
    content,
    postID,
    image,
    oldImage,
  }: {
    content: string;
    image: ImageFile | null;
    postID: string;
    oldImage: string | undefined;
  }): Promise<Partial<Post>> => {
    try {
      let formData = new FormData();
      formData.append('content', content);
      formData.append('postID', postID);
      if (oldImage) {
        formData.append('oldImage', oldImage);
      }
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
        'patch',
        getEditPostUrl(),
        formData,
        {},
        'multipart/form-data',
      );
      if (res) {
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

export const requestReportPost = createAsyncThunk(
  'post/requestReportPost',
  async ({
    content,
    postID,
  }: {
    content: string;
    postID: string;
  }): Promise<Partial<Post>> => {
    try {
      const data = {
        content,
        postID,
      };
      const res = await callAPI('post', getReportPostUrl(), data, {});
      if (res) {
        showAlert('Chúng tôi đã nhận được báo cáo của bạn', 'success');
        return new Promise(resolve => {
          resolve({
            status: true,
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
const initialState: PostState = {
  listPost: [],
  listComment: [],
  postID: '',
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
        state.listPost = [action.payload.post, ...listPostCoppy];
      } else {
        state.listPost[indexOfPost] = action.payload.post;
      }
    },
    updateListComment: (state, action) => {
      if (action.payload.comment.post === state.postID) {
        const listCommentCoppy = [...state.listComment];
        state.listComment = [action.payload.comment, ...listCommentCoppy];
      }
    },
  },
  extraReducers: builder => {
    builder.addCase(requestGetPost.pending, state => {});
    builder.addCase(requestGetPost.fulfilled, (state, action) => {
      if (action.payload.status) {
        if (action.payload.listPost) {
          if (action.payload.skip === 0) {
            state.listPost = action.payload.listPost;
          } else {
            state.listPost = [...state.listPost, ...action.payload.listPost];
          }
        }
      }
    });
    builder.addCase(requestGetPost.rejected, state => {});
    builder.addCase(requestGetComment.pending, state => {});
    builder.addCase(requestGetComment.fulfilled, (state, action) => {
      if (action.payload.status) {
        if (action.payload.currentPage === 1) {
          if (action.payload.postID) {
            state.postID = action.payload.postID;
          }
          if (action.payload.listComment) {
            state.listComment = action.payload.listComment;
          }
        } else {
          if (action.payload.listComment) {
            state.listComment = [
              ...state.listComment,
              ...action.payload.listComment,
            ];
          }
        }
      }
    });
    builder.addCase(requestGetComment.rejected, state => {});
  },
});

export const {updateListPost, updateListComment} = postSlice.actions;

export default postSlice.reducer;
