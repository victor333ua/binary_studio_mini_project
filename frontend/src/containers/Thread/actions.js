import * as postService from 'src/services/postService';

import {
  ADD_POST,
  LOAD_MORE_POSTS,
  SET_ALL_POSTS,
  DELETE_POST,
  UPDATE_POST,
  ADD_LIKE
} from './actionTypes';

const setPostsAction = posts => ({
  type: SET_ALL_POSTS,
  posts
});

const addMorePostsAction = posts => ({
  type: LOAD_MORE_POSTS,
  posts
});

const addPostAction = post => ({
  type: ADD_POST,
  post
});

export const loadPosts = filter => async dispatch => {
  const posts = await postService.getAllPosts(filter);
  dispatch(setPostsAction(posts));
};

export const loadMorePosts = filter => async (dispatch, getRootState) => {
  const { posts: { posts } } = getRootState();
  const loadedPosts = await postService.getAllPosts(filter);
  const filteredPosts = loadedPosts
    .filter(post => !(posts && posts.some(loadedPost => post.id === loadedPost.id)));
  dispatch(addMorePostsAction(filteredPosts));
};

export const applyPost = postId => async dispatch => {
  const post = await postService.getPost(postId);
  dispatch(addPostAction(post));
};

export const addPost = post => async dispatch => {
  const id = await postService.addPost(post);
  const newPost = await postService.getPost(id);
  dispatch(addPostAction(newPost));
};

export const likePost = (postId, postOwnerId, isLike) => async dispatch => {
  let isNewRecord;
  try {
    isNewRecord = await postService.likePost(postId, postOwnerId, isLike);
    if (isNewRecord === undefined) isNewRecord = null;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
  dispatch({ type: ADD_LIKE, payload: { postId, isLike, isNewRecord } });
};

export const deletePost = id => async dispatch => {
  try {
    await postService.deletePost(id);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
  dispatch({ type: DELETE_POST, id });
};

export const updatePost = post => async dispatch => {
  try {
    await postService.editPost(post);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
  dispatch({ type: UPDATE_POST, post });
};

