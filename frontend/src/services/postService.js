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
  // return response.json();
};

export const editPost = async post => {
  const response = await callWebApi({
    endpoint: '/api/posts',
    type: 'PUT',
    request: {
      id: post.id,
      body: post.body
    }
  });
  console.log(response);
  // return response.json();
};

// should be replaced by appropriate function
export const getPostByHash = async hash => getPost(hash);
