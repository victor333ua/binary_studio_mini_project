import * as postService from 'src/services/postService';

import {
  ADD_POST,
  LOAD_MORE_POSTS,
  SET_ALL_POSTS,
  DELETE_POST,
  UPDATE_POST,
  ADD_LIKE,
  ACTION_REJECTED,
  RESET_ERROR
} from './actionTypes';

export const postsRejected = error => ({
  type: ACTION_REJECTED,
  error
});

const setPostsAction = (posts, postsFilter) => ({
  type: SET_ALL_POSTS,
  payload: { posts, postsFilter }
});

const addMorePostsAction = (posts, postsFilter) => ({
  type: LOAD_MORE_POSTS,
  payload: { posts, postsFilter }
});

const addPostAction = post => ({
  type: ADD_POST,
  post
});

export const likePostAction = ({ postId, isLike, isNewRecord, currentUser }) => ({
  type: ADD_LIKE,
  payload: { postId, isLike, isNewRecord, currentUser }
});

export const deletePostAction = id => ({
  type: DELETE_POST,
  id
});

export const updatePostAction = ({ id, body, image }) => ({
  type: UPDATE_POST,
  payload: { id, body, image }
});

export const loadPosts = filter => async dispatch => {
  try {
    const posts = await postService.getAllPosts(filter);
    dispatch(setPostsAction(posts, filter));
  } catch (err) {
    dispatch(postsRejected(err));
  }
};

export const loadMorePosts = filter => async (dispatch, getRootState) => {
  const { posts: { posts } } = getRootState();
  try {
    const loadedPosts = await postService.getAllPosts(filter);
    const filteredPosts = loadedPosts
      .filter(post => !(posts && posts.some(loadedPost => post.id === loadedPost.id)));
    dispatch(addMorePostsAction(filteredPosts, filter));
  } catch (err) {
    dispatch(postsRejected(err));
  }
};

export const applyPost = postId => async dispatch => {
  try {
    const post = await postService.getPost(postId);
    dispatch(addPostAction(post));
  } catch (err) {
    dispatch(postsRejected(err));
  }
};

export const addPost = post => async dispatch => {
  try {
    const { postId } = await postService.addPost(post);
    await applyPost(postId)(dispatch);
  } catch (err) {
    dispatch(postsRejected(err));
  }
};

export const likePost = ({ postId, createdAt, postOwner, isLike, currentUser }) => async dispatch => {
  let isNewRecord;
  try {
    isNewRecord = await postService.likePost({ postId, createdAt, postOwner, isLike, currentUser });
    if (isNewRecord === undefined) isNewRecord = null;
    dispatch(likePostAction({ postId, isLike, isNewRecord, currentUser }));
  } catch (err) {
    dispatch(postsRejected(err));
  }
};

export const deletePost = ({ id, currentUser }) => async dispatch => {
  try {
    await postService.deletePost({ id, currentUser });
    dispatch(deletePostAction(id));
  } catch (err) {
    dispatch(postsRejected(err));
  }
};

export const updatePost = ({ id, body, image, currentUser }) => async dispatch => {
  try {
    await postService.editPost({ id, body, image, currentUser });
    dispatch(updatePostAction({ id, body, image }));
  } catch (err) {
    dispatch(postsRejected(err));
  }
};

export const resetError = () => ({ type: RESET_ERROR });

