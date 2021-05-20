import callWebApi from 'src/helpers/webApiHelper';

export const addComment = async request => {
  const response = await callWebApi({
    endpoint: '/api/comments',
    type: 'POST',
    request
  });
  return response.json();
};

export const getComment = async id => {
  const response = await callWebApi({
    endpoint: `/api/comments/${id}`,
    type: 'GET'
  });
  return response.json();
};

export const likeComment = async ({ commentId, postId, isLike, currentUser }) => {
  const response = await callWebApi({
    endpoint: '/api/commentReaction',
    type: 'PUT',
    request: { commentId, postId, isLike, currentUser }
  });
  return response.json();
};

export const deleteComment = async ({ id, postId }) => {
  await callWebApi({
    endpoint: '/api/comments',
    type: 'DELETE',
    request: { id, postId }
  });
};

export const updateComment = async ({ id, postId, body }) => {
  await callWebApi({
    endpoint: '/api/comments',
    type: 'PUT',
    request: { id, postId, body }
  });
};
