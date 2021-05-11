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
      const { postId, isLike, isNewRecord, currentUser } = action.payload;
      const updatedPosts = state.posts.map(post => (post.id !== postId
        ? post
        : addLike(post, isLike, isNewRecord, currentUser)
      ));
      let exPost = state.expandedPost;
      if (exPost && exPost.id === postId) exPost = addLike(exPost, isLike, isNewRecord, currentUser);
      return { ...state, posts: updatedPosts, expandedPost: exPost };
    }
    case ADD_COMMENT: {
      const updatedPosts = state.posts.map(post => (post.id !== action.payload.postId
        ? post
        : ({ ...post, commentCount: Number(post.commentCount) + 1 })));

      const exPost = state.expandedPost;
      const newExPost = {
        ...exPost,
        comments: [...(exPost.comments || []), action.payload.comment],
        commentCount: Number(exPost.commentCount) + 1
      };

      return { ...state, posts: updatedPosts, expandedPost: newExPost };
    }
    case ADD_LIKE_COMMENT: {
      const exPost = state.expandedPost;
      const { commentId, isLike, isNewRecord, currentUser } = action.payload;
      const newComments = exPost.comments
        .map(c => (c.id !== commentId
          ? c
          : addLike(c, isLike, isNewRecord, currentUser)));
      return { ...state, expandedPost: { ...exPost, comments: newComments } };
    }
    case UPDATE_COMMENT: {
      const exPost = state.expandedPost;
      const { id, body } = action.comment;
      const newComments = exPost.comments.map(c => (c.id !== id ? c : { ...c, body }));
      return { ...state, expandedPost: { ...exPost, comments: newComments } };
    }
    case DELETE_COMMENT: {
      const exPost = state.expandedPost;
      const newComments = [...exPost.comments];
      const index = newComments.findIndex(comment => comment.id === action.id);
      newComments.splice(index, 1);
      return { ...state,
        expandedPost: {
          ...exPost,
          comments: newComments,
          commentCount: Number(exPost.commentCount) - 1
        } };
    }
    default:
      return state;
  }
};
