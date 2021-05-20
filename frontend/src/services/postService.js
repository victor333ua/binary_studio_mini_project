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
  return response.json();
};

export const getPost = async id => {
  const response = await callWebApi({
    endpoint: `/api/posts/${id}`,
    type: 'GET'
  });
  return response.json();
};

export const likePost = async ({ postId, postOwnerId, isLike, currentUser }) => {
  const response = await callWebApi({
    endpoint: '/api/postreaction',
    type: 'PUT',
    request: {
      postId,
      postOwnerId,
      isLike,
      currentUser
    }
  });
  return response.json();
};

export const deletePost = async ({ id, currentUser }) => {
  await callWebApi({
    endpoint: '/api/posts',
    type: 'DELETE',
    request: { id, currentUser }
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
