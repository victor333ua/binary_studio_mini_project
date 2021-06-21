import { createAsyncThunk } from '@reduxjs/toolkit';
import * as postService from '../../services/postService';

export const loadMorePosts = createAsyncThunk(
  'posts/loadMore',
  async (filter, { getState }) => {
    const { posts: { posts } } = getState();
    const loadedPosts = await postService.getAllPosts(filter);
    const filteredPosts = loadedPosts
      .filter(post => !(posts && posts.some(loadedPost => post.id === loadedPost.id)));

    return { posts: filteredPosts, selector: filter.selector };
  }
);
export const applyPost = createAsyncThunk(
  'posts/getOne',
  async postId => {
    const post = await postService.getPost(postId);
    return { post };
  }
);
export const addPost = createAsyncThunk(
  'posts/addPost',
  async (post, { dispatch }) => {
    const { postId } = await postService.addPost(post);
    dispatch(applyPost(postId));
  }
);
export const deletePost = createAsyncThunk(
  'posts/delete',
  async ({ id, currentUser }) => {
    await postService.deletePost({ id, currentUser });
    return { id };
  }
);
export const updatePost = createAsyncThunk(
  'posts/update',
  async ({ id, body, image, currentUser }) => {
    await postService.editPost({ id, body, image, currentUser });
    return { id, body, image };
  }
);
export const likePost = createAsyncThunk(
  'posts/like',
  async ({ postId, createdAt, postOwner, isLike, currentUser }) => {
    const isNewRecord = await postService.likePost({ postId, createdAt, postOwner, isLike, currentUser });
    return { postId, isLike, isNewRecord, currentUser };
  }
);
