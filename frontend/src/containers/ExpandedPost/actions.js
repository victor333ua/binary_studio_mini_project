import {
  SET_EXPANDED_POST,
  ADD_COMMENT,
  ADD_LIKE_COMMENT,
  DELETE_COMMENT,
  UPDATE_COMMENT
} from './actionTypes';

import * as postService from '../../services/postService';
import * as commentService from '../../services/commentService';

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
  const post = postId ? await postService.getPost(postId) : undefined;
  dispatch({ type: SET_EXPANDED_POST, post });
};

export const addComment = ({ postId, body }) => async dispatch => {
  const comment = await commentService.addComment({ postId, body });
  dispatch(addCommentAction(comment));
};

export const likeComment = ({ commentId, postId, isLike, currentUser }) => async dispatch => {
  let isNewRecord = await commentService.likeComment({ commentId, postId, isLike, currentUser });
  if (isNewRecord === undefined) isNewRecord = null;
  dispatch(likeCommentAction({ isNewRecord, commentId, isLike, currentUser }));
};

export const deleteComment = ({ id, postId }) => async dispatch => {
  await commentService.deleteComment({ id, postId });
  dispatch(deleteCommentAction({ id, postId }));
};

export const updateComment = ({ id, postId, body }) => async dispatch => {
  await commentService.updateComment({ id, postId, body });
  dispatch(updateCommentAction({ id, body }));
};

