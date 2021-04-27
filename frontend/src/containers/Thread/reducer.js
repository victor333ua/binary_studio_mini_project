import {
  SET_ALL_POSTS,
  LOAD_MORE_POSTS,
  ADD_POST,
  DELETE_POST,
  UPDATE_POST,
  ADD_LIKE
} from './actionTypes';

import {
  SET_EXPANDED_POST,
  ADD_COMMENT,
  ADD_LIKE_COMMENT,
  UPDATE_COMMENT,
  DELETE_COMMENT
} from '../ExpandedPost/actionTypes';

import { addLike } from '../../helpers/likesHelper';

export default (state = {}, action) => {
  switch (action.type) {
    case SET_ALL_POSTS:
      return {
        ...state,
        posts: action.posts,
        hasMorePosts: Boolean(action.posts.length)
      };
    case LOAD_MORE_POSTS:
      return {
        ...state,
        posts: [...(state.posts || []), ...action.posts],
        hasMorePosts: Boolean(action.posts.length)
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
      const index = state.posts.findIndex(post => post.id === action.post.id);
      const updatedPosts = [...state.posts];
      updatedPosts.splice(index, 1, action.post);
      return { ...state, posts: updatedPosts };
    }
    case ADD_LIKE: {
      const { postId, isLike, isNewRecord } = action.payload;
      const updatedPosts = state.posts.map(post => (post.id !== postId ? post : addLike(post, isLike, isNewRecord)));
      let exPost = state.expandedPost;
      if (exPost && exPost.id === postId) exPost = addLike(exPost, isLike, isNewRecord);
      return { ...state, posts: updatedPosts, expandedPost: exPost };
    }
    case ADD_COMMENT: {
      const updatedPosts = state.posts.map(post => (post.id !== action.comment.postId
        ? post
        : ({ ...post, commentCount: Number(post.commentCount) + 1 })));
      let exPost = state.expandedPost;
      if (exPost) {
        exPost = {
          ...exPost,
          comments: [...(exPost.comments || []), action.comment]
        };
      }
      return { ...state, posts: updatedPosts, expandedPost: exPost };
    }
    case ADD_LIKE_COMMENT: {
      let exPost = state.expandedPost;
      const { commentId, isLike, isNewRecord } = action.payload;
      const newComments = exPost.comments.map(c => (c.id !== commentId ? c : addLike(c, isLike, isNewRecord)));
      exPost = { ...exPost, comments: newComments };
      return { ...state, expandedPost: exPost };
    }
    case UPDATE_COMMENT: {
      let exPost = state.expandedPost;
      const { id, body } = action.comment;
      const newComments = exPost.comments.map(c => (c.id !== id ? c : { ...c, body }));
      exPost = { ...exPost, comments: newComments };
      return { ...state, expandedPost: exPost };
    }
    case DELETE_COMMENT: {
      let exPost = state.expandedPost;
      const newComments = [...exPost.comments];
      const index = newComments.findIndex(comment => comment.id === action.id);
      newComments.splice(index, 1);
      exPost = { ...exPost, comments: newComments };
      return { ...state, expandedPost: exPost };
    }
    default:
      return state;
  }
};
