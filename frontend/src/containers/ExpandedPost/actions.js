import {
  SET_EXPANDED_POST,
  ADD_COMMENT,
  ADD_LIKE_COMMENT,
  DELETE_COMMENT,
  UPDATE_COMMENT
} from './actionTypes';

import * as postService from '../../services/postService';
import * as commentService from '../../services/commentService';

export const toggleExpandedPost = postId => async dispatch => {
  const post = postId ? await postService.getPost(postId) : undefined;
  dispatch({ type: SET_EXPANDED_POST, post });
};

export const addComment = ({ postId, body }) => async dispatch => {
  const { id } = await commentService.addComment({ postId, body });
  const comment = await commentService.getComment(id);

  dispatch({ type: ADD_COMMENT, payload: { postId, comment } });
};

export const likeComment = (commentId, isLike) => async dispatch => {
  let isNewRecord = await commentService.likeComment(commentId, isLike);
  if (isNewRecord === undefined) isNewRecord = null;

  dispatch({ type: ADD_LIKE_COMMENT, payload: { isNewRecord, commentId, isLike } });
};

export const deleteComment = id => async dispatch => {
  await commentService.deleteComment(id);
  dispatch({ type: DELETE_COMMENT, id });
};

export const updateComment = comment => async dispatch => {
  await commentService.updateComment(comment);
  dispatch({ type: UPDATE_COMMENT, comment });
};

