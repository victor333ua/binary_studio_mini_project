import * as postService from 'src/services/postService';

import {
  ADD_POST,
  LOAD_MORE_POSTS,
  SET_ALL_POSTS,
  DELETE_POST,
  UPDATE_POST,
  ADD_LIKE,
  ACTION_REJECTED
} from './actionTypes';

const postsRejected = error => ({
  type: ACTION_REJECTED,
  error
});

const setPostsAction = (posts, selector) => ({
  type: SET_ALL_POSTS,
  payload: { posts, selector }
});

const addMorePostsAction = posts => ({
  type: LOAD_MORE_POSTS,
  posts
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
  const posts = await postService.getAllPosts(filter);
  dispatch(setPostsAction(posts, filter.selector));
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
  const { postId } = await postService.addPost(post);
  await applyPost(postId)(dispatch);
};

export const likePost = ({ postId, createdAt, postOwner, isLike, currentUser }) => async dispatch => {
  let isNewRecord;
  try {
    isNewRecord = await postService.likePost({ postId, createdAt, postOwner, isLike, currentUser });
    if (isNewRecord === undefined) isNewRecord = null;
  } catch (err) {
    dispatch(postsRejected(err));
  }
  dispatch(likePostAction({ postId, isLike, isNewRecord, currentUser }));
};

export const deletePost = ({ id, currentUser }) => async dispatch => {
  try {
    await postService.deletePost({ id, currentUser });
  } catch (err) {
    dispatch(postsRejected(err));
  }
  dispatch(deletePostAction(id));
};

export const updatePost = ({ id, body, image, currentUser }) => async dispatch => {
  try {
    await postService.editPost({ id, body, image, currentUser });
  } catch (err) {
    dispatch(postsRejected(err));
  }
  dispatch(updatePostAction({ id, body, image }));
};

