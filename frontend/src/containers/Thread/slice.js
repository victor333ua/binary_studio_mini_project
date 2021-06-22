import { createSlice } from '@reduxjs/toolkit';
import { applyPost, deletePost, likePost, updatePost, loadMorePosts } from './asyncThunks';
import { addLike } from '../../helpers/likesHelper';
import { addComment, deleteComment, likeComment, toggleExpandedPost, updateComment } from '../ExpandedPost/asyncThunks';

const initialState = {
  posts: [],
  status: 'idle',
  error: null,
  pFilter: { selector: 0, from: 0, count: 10 },
  hasMorePosts: true
};

const setError = (state, action) => {
  state.status = 'error';
  state.error = action.error;
};

const setPending = state => {
  state.status = 'loading';
  state.error = null;
};

const deletePostAct = (state, action) => {
  const index = state.posts.findIndex(post => post.id === action.payload.id);
  state.posts.splice(index, 1);
  state.status = 'completed';
};
const updatePostAct = (state, action) => {
  const { id, body, image } = action.payload;
  const index = state.posts.findIndex(post => post.id === id);
  const updatedItem = { ...state.posts[index], body, image };
  state.posts.splice(index, 1, updatedItem);
  const exPost = state.expandedPost;
  if (exPost && exPost.id === id) state.expandedPost = { ...exPost, body, image };
  state.status = 'completed';
};
const likePostAct = (state, action) => {
  const { postId, isLike, isNewRecord, currentUser } = action.payload;
  state.posts = state.posts.map(post => (post.id !== postId
    ? post
    : addLike(post, isLike, isNewRecord, currentUser)
  ));
  const exPost = state.expandedPost;
  if (exPost && exPost.id === postId) {
    state.expandedPost = addLike(exPost, isLike, isNewRecord, currentUser);
  }
  state.status = 'completed';
};
const addCommentAct = (state, action) => {
  const { postId } = action.payload.comment;
  state.posts = state.posts.map(post => (post.id !== postId
    ? post
    : ({ ...post, commentCount: Number(post.commentCount) + 1 })));

  const exPost = state.expandedPost;
  if (exPost && exPost.id === postId) {
    state.expandedPost = {
      ...exPost,
      comments: [...(exPost.comments || []), action.payload.comment],
      commentCount: Number(exPost.commentCount) + 1
    };
  }
  state.status = 'completed';
};
const likeCommentAct = (state, action) => {
  const exPost = state.expandedPost;
  const { postId, commentId, isLike, isNewRecord, currentUser } = action.payload;
  if (exPost && exPost.id === postId) {
    state.expandedPost.comments = exPost.comments
      .map(c => (c.id !== commentId
        ? c
        : addLike(c, isLike, isNewRecord, currentUser)));
  }
  state.status = 'completed';
};
const updateCommentAct = (state, action) => {
  const { id, body } = action.payload;
  state.expandedPost.comments = state.expandedPost.comments
    .map(c => (c.id !== id ? c : { ...c, body }));
  state.status = 'completed';
};
const deleteCommentAct = (state, action) => {
  const { id, postId } = action.payload;
  state.posts = state.posts.map(post => (post.id !== postId
    ? post
    : ({ ...post, commentCount: Number(post.commentCount) - 1 })));

  const exPost = state.expandedPost;
  if (exPost && exPost.id === postId) {
    const index = exPost.comments.findIndex(comment => comment.id === id);
    state.expandedPost.comments.splice(index, 1);
    state.expandedPost.commentCount = Number(exPost.commentCount) - 1;
  }
  state.status = 'completed';
};
// ________________________________________   Slice    ________________________________

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postsRejected: setError,
    postsLoading: setPending,
    postsResetError(state) {
      state.error = null;
      state.status = 'idle';
    },
    postsReset(state) {
      state.posts = [];
      state.pFilter.from = 0;
      state.hasMorePosts = true;// !important, otherwise loadMore don't work after switch
    },
    deletePostAction: deletePostAct,
    updatePostAction: updatePostAct,
    likePostAction: likePostAct,
    deleteCommentAction: deleteCommentAct,
    updateCommentAction: updateCommentAct,
    likeCommentAction: likeCommentAct,
    addCommentAction: addCommentAct
  },
  extraReducers: {
    [loadMorePosts.fulfilled]: (state, action) => {
      state.posts = [...(state.posts || []), ...action.payload.posts];
      const filter = state.pFilter;
      state.pFilter = { selector: action.payload.selector, from: filter.from + filter.count, count: filter.count };
      state.hasMorePosts = Boolean(action.payload.posts.length);
      state.status = 'completed';
    },

    [applyPost.fulfilled]: (state, action) => {
      state.posts.unshift(action.payload.post);
      state.status = 'completed';
    },
    [applyPost.pending]: setPending,
    [applyPost.rejected]: setError,

    [deletePost.fulfilled]: deletePostAct,
    [deletePost.pending]: setPending,
    [deletePost.rejected]: setError,

    [updatePost.fulfilled]: updatePostAct,
    [updatePost.pending]: setPending,
    [updatePost.rejected]: setError,

    [likePost.fulfilled]: likePostAct,
    [likePost.pending]: setPending,
    [likePost.rejected]: setError,

    // ______________   ExpandedPost   ________________________________________________

    [toggleExpandedPost.fulfilled]: (state, action) => {
      state.expandedPost = action.payload?.post;
      state.status = 'completed';
    },
    [toggleExpandedPost.pending]: setPending,
    [toggleExpandedPost.rejected]: setError,

    [addComment.fulfilled]: addCommentAct,
    [addComment.pending]: setPending,
    [addComment.rejected]: setError,

    [likeComment.fulfilled]: likeCommentAct,
    [likeComment.pending]: setPending,
    [likeComment.rejected]: setError,

    [updateComment.fulfilled]: updateCommentAct,
    [updateComment.pending]: setPending,
    [updateComment.rejected]: setError,

    [deleteComment.fulfilled]: deleteCommentAct,
    [deleteComment.pending]: setPending,
    [deleteComment.rejected]: setError
  }
});
export default postsSlice.reducer;
export const {
  postsRejected,
  postsLoading,
  postsResetError,
  postsReset,
  deletePostAction,
  updatePostAction,
  likePostAction,
  deleteCommentAction,
  updateCommentAction,
  likeCommentAction,
  addCommentAction
} = postsSlice.actions;
