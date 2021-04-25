import {
  SET_ALL_POSTS,
  LOAD_MORE_POSTS,
  ADD_POST,
  SET_EXPANDED_POST,
  DELETE_POST,
  UPDATE_POST
} from './actionTypes';

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
      const updatePosts = [...state.posts];
      updatePosts.splice(index, 1, action.post);
      return {
        ...state,
        posts: updatePosts
      };
    }
    default:
      return state;
  }
};
