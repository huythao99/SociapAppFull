import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {showAlert} from '../../ultilities/Ultilities';
import {Post, PostItem} from '../../constant/types';
import storage from '@react-native-firebase/storage';
import callAPI from '../../apis/api';
import {getAllPost, getCreatePostUrl} from '../../apis/url';

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
      showAlert('Đăng bài thành công', 'success');
      return new Promise(resolve => {
        resolve({
          status: true,
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

export const requestGetPost = createAsyncThunk(
  'post/requestGetPost',
  async ({page}: {page: number}): Promise<Partial<Post>> => {
    try {
      const params = {
        page,
      };
      const res = await callAPI('get', getAllPost(), {}, params);
      return new Promise(resolve => {
        resolve({
          status: true,
          listPost: res.listPost,
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

// export const requestLikePost = createAsyncThunk(
//   'post/requestLikePost',
//   async ({postID, userID}: {postID: string; userID: string}) => {
//     firestore()
//       .collection('Posts')
//       .get()
//       .then(querySnapshot => {
//         querySnapshot.forEach(async documentSnapshot => {
//           if (documentSnapshot.data().id === postID) {
//             let newListUserLike = [];
//             const index = documentSnapshot
//               .data()
//               .listUserLike.findIndex((item: string) => item === userID);
//             if (index === -1) {
//               newListUserLike = [
//                 ...documentSnapshot.data().listUserLike,
//                 userID,
//               ];
//             } else {
//               newListUserLike = documentSnapshot
//                 .data()
//                 .listUserLike.filter((item: string) => item !== userID);
//             }
//             firestore()
//               .collection('Posts')
//               .doc(documentSnapshot.id)
//               .update({
//                 listUserLike: newListUserLike,
//               })
//               .then(() => {})
//               .catch(error => {
//                 showAlert(error.message, 'danger');
//               });
//           }
//         });
//       })
//       .catch(error => {
//         showAlert(error.message, 'danger');
//       });
//   },
// );

// Define the initial state using that type
const initialState: PostState = {
  listPost: [],
  currentPage: 1,
};

export const postSlice = createSlice({
  name: 'post',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {},
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

export const {} = postSlice.actions;

export default postSlice.reducer;
