import callWebApi from 'src/helpers/webApiHelper';

export const getAllPosts = async filter => {
  const response = await callWebApi({
    endpoint: '/api/posts',
    type: 'GET',
    query: filter
  });
  return response.json();
};

export const addPost = async request => {
  const response = await callWebApi({
    endpoint: '/api/posts',
    type: 'POST',
    request
  });
  // server returns UUID
  return response.text();
};

export const getPost = async id => {
  const response = await callWebApi({
    endpoint: `/api/posts/${id}`,
    type: 'GET'
  });
  return response.json();
};

export const likePost = async (postId, postOwnerId, isLike) => {
  const response = await callWebApi({
    endpoint: '/api/postreaction',
    type: 'PUT',
    request: {
      postId,
      postOwnerId,
      isLike
    }
  });
  return response.json();
};

export const deletePost = async postId => {
  await callWebApi({
    endpoint: `/api/posts/${postId}`,
    type: 'DELETE'
  });
};

export const editPost = async post => {
  await callWebApi({
    endpoint: '/api/posts',
    type: 'PUT',
    request: post
  });
};

// should be replaced by appropriate function
export const getPostByHash = async hash => getPost(hash);
