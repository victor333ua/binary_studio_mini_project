import { createAsyncThunk } from '@reduxjs/toolkit';
import * as postService from '../../services/postService';
import * as commentService from '../../services/commentService';

export const toggleExpandedPost = createAsyncThunk(
  'posts/expandedPost',
  async postId => {
    if (!postId) return undefined;
    const post = await postService.getPost(postId);
    return { post };
  }
);
export const addComment = createAsyncThunk(
  'posts/addComment',
  async ({ postId, body }) => {
    const comment = await commentService.addComment({ postId, body });
    return { comment };
  }
);
export const likeComment = createAsyncThunk(
  'posts/likeComment',
  async ({ commentId, postId, isLike, currentUser }) => {
    const isNewRecord = await commentService.likeComment({ commentId, postId, isLike, currentUser });
    return { postId, isNewRecord, commentId, isLike, currentUser };
  }
);
export const deleteComment = createAsyncThunk(
  'posts/deleteComment',
  async ({ id, postId }) => {
    await commentService.deleteComment({ id, postId });
    return { id, postId };
  }
);
export const updateComment = createAsyncThunk(
  'posts/updateComment',
  async ({ id, postId, body }) => {
    await commentService.updateComment({ id, postId, body });
    return { id, body };
  }
);
