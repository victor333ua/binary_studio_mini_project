import {
  SET_EXPANDED_POST,
  ADD_COMMENT,
  ADD_LIKE_COMMENT,
  DELETE_COMMENT,
  UPDATE_COMMENT
} from './actionTypes';

import * as postService from '../../services/postService';
import * as commentService from '../../services/commentService';
import { postsRejected } from '../Thread/actions';

export const likeCommentAction = ({ isNewRecord, commentId, isLike, currentUser }) => (
  { type: ADD_LIKE_COMMENT,
    payload: { isNewRecord, commentId, isLike, currentUser }
  });

export const addCommentAction = comment => (
  { type: ADD_COMMENT, comment }
);

export const deleteCommentAction = ({ id, postId }) => (
  { type: DELETE_COMMENT, payload: { id, postId } }
);

export const updateCommentAction = ({ id, body }) => (
  { type: UPDATE_COMMENT, payload: { id, body } }
);

export const toggleExpandedPost = postId => async dispatch => {
  try {
    const post = postId ? await postService.getPost(postId) : undefined;
    dispatch({ type: SET_EXPANDED_POST, post });
  } catch (err) {
    dispatch(postsRejected(err));
  }
};

export const addComment = ({ postId, body }) => async dispatch => {
  try {
    const comment = await commentService.addComment({ postId, body });
    dispatch(addCommentAction(comment));
  } catch (err) {
    dispatch(postsRejected(err));
  }
};

export const likeComment = ({ commentId, postId, isLike, currentUser }) => async dispatch => {
  try {
    let isNewRecord = await commentService.likeComment({ commentId, postId, isLike, currentUser });
    if (isNewRecord === undefined) isNewRecord = null;
    dispatch(likeCommentAction({ postId, isNewRecord, commentId, isLike, currentUser }));
  } catch (err) {
    dispatch(postsRejected(err));
  }
};

export const deleteComment = ({ id, postId }) => async dispatch => {
  try {
    await commentService.deleteComment({ id, postId });
    dispatch(deleteCommentAction({ id, postId }));
  } catch (err) {
    dispatch(postsRejected(err));
  }
};

export const updateComment = ({ id, postId, body }) => async dispatch => {
  try {
    await commentService.updateComment({ id, postId, body });
    dispatch(updateCommentAction({ id, body }));
  } catch (err) {
    dispatch(postsRejected(err));
  }
};

