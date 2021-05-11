import callWebApi from 'src/helpers/webApiHelper';

export const addComment = async request => {
  const response = await callWebApi({
    endpoint: '/api/comments',
    type: 'POST',
    request
  });
  // server returns UUID
  return response.text();
};

export const getComment = async id => {
  const response = await callWebApi({
    endpoint: `/api/comments/${id}`,
    type: 'GET'
  });
  return response.json();
};

export const likeComment = async (commentId, isLike) => {
  const response = await callWebApi({
    endpoint: '/api/commentreaction',
    type: 'PUT',
    request: {
      commentId,
      isLike
    }
  });
  return response.json();
};

export const deleteComment = async id => {
  await callWebApi({
    endpoint: `/api/comments/${id}`,
    type: 'DELETE'
  });
};

export const updateComment = async comment => {
  await callWebApi({
    endpoint: '/api/comments',
    type: 'PUT',
    request: {
      id: comment.id,
      body: comment.body
    }
  });
};
