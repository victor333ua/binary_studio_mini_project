import {
  ACTION_REJECTED,
  ADD_LIKE,
  ADD_POST,
  DELETE_POST,
  LOAD_MORE_POSTS,
  SET_ALL_POSTS,
  UPDATE_POST,
  RESET_ERROR
} from './actionTypes';

import {
  ADD_COMMENT,
  ADD_LIKE_COMMENT,
  DELETE_COMMENT,
  SET_EXPANDED_POST,
  UPDATE_COMMENT
} from '../ExpandedPost/actionTypes';

import { addLike } from '../../helpers/likesHelper';

export default (state = {
  status: 'idle',
  error: null
}, action) => {
  switch (action.type) {
    case SET_ALL_POSTS:
      return {
        ...state,
        posts: action.payload.posts,
        pFilter: action.payload.postsFilter,
        hasMorePosts: Boolean(action.payload.posts.length)
      };
    case LOAD_MORE_POSTS:
      return {
        ...state,
        posts: [...(state.posts || []), ...action.payload.posts],
        pFilter: action.payload.postsFilter,
        hasMorePosts: Boolean(action.payload.posts.length)
      };
    case ADD_POST:
      return {
        ...state,
        posts: [action.post, ...state.posts]
      };
    case SET_EXPANDED_POST:
      return {
        ...state,
        expandedPost: action.post
      };
    case DELETE_POST: {
      const index = state.posts.findIndex(post => post.id === action.id);
      const updatePosts = [...state.posts];
      updatePosts.splice(index, 1);
      return {
        ...state,
        posts: updatePosts
      };
    }
    case UPDATE_POST: {
      const { id, body, image } = action.payload;
      const index = state.posts.findIndex(post => post.id === id);
      const updatedItem = { ...state.posts[index], body, image };
      const updatedPosts = [...state.posts];
      updatedPosts.splice(index, 1, updatedItem);
      let exPost = state.expandedPost;
      if (exPost && exPost.id === id) exPost = { ...exPost, body, image };
      return {
        ...state,
        posts: updatedPosts,
        expandedPost: exPost
      };
    }
    case ADD_LIKE: {
      const { postId, isLike, isNewRecord, currentUser } = action.payload;
      const updatedPosts = state.posts.map(post => (post.id !== postId
        ? post
        : addLike(post, isLike, isNewRecord, currentUser)
      ));
      let exPost = state.expandedPost;
      if (exPost && exPost.id === postId) {
        exPost = addLike(exPost, isLike, isNewRecord, currentUser);
      }
      return { ...state, posts: updatedPosts, expandedPost: exPost };
    }
    case ADD_COMMENT: {
      const { postId } = action.comment;
      const updatedPosts = state.posts.map(post => (post.id !== postId
        ? post
        : ({ ...post, commentCount: Number(post.commentCount) + 1 })));

      let exPost = state.expandedPost;
      if (exPost && exPost.id === postId) {
        exPost = {
          ...exPost,
          comments: [...(exPost.comments || []), action.comment],
          commentCount: Number(exPost.commentCount) + 1
        };
      }
      return { ...state, posts: updatedPosts, expandedPost: exPost };
    }
    case ADD_LIKE_COMMENT: {
      const exPost = state.expandedPost;
      const { postId, commentId, isLike, isNewRecord, currentUser } = action.payload;
      if (!exPost || exPost.id !== postId) return state;

      const newComments = exPost.comments
        .map(c => (c.id !== commentId
          ? c
          : addLike(c, isLike, isNewRecord, currentUser)));
      return { ...state, expandedPost: { ...exPost, comments: newComments } };
    }
    case UPDATE_COMMENT: {
      const exPost = state.expandedPost;
      const { id, body } = action.payload;
      const newComments = exPost.comments.map(c => (c.id !== id ? c : { ...c, body }));
      return { ...state, expandedPost: { ...exPost, comments: newComments } };
    }
    case DELETE_COMMENT: {
      const { id, postId } = action.payload;
      const updatedPosts = state.posts.map(post => (post.id !== postId
        ? post
        : ({ ...post, commentCount: Number(post.commentCount) - 1 })));

      let exPost = state.expandedPost;
      if (exPost && exPost.id === postId) {
        const newComments = [...exPost.comments];
        const index = newComments.findIndex(comment => comment.id === id);
        newComments.splice(index, 1);
        exPost = {
          ...exPost,
          comments: newComments,
          commentCount: Number(exPost.commentCount) - 1
        };
      }
      return { ...state, posts: updatedPosts, expandedPost: exPost };
    }
    case ACTION_REJECTED:
      return { ...state, status: 'error', error: action.error };

    case RESET_ERROR:
      return { ...state, status: 'idle', error: null };

    default:
      return state;
  }
};
