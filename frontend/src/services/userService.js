import callWebApi from '../helpers/webApiHelper';

export const save = async user => {
  await callWebApi({
    endpoint: '/api/user',
    type: 'PUT',
    request: user
  });
};

export const getAll = async () => {
  const response = await callWebApi({
    endpoint: '/api/user/all',
    type: 'GET'
  });
  return response.json();
};

export const getRoles = async () => {
  const response = await callWebApi({
    endpoint: '/api/role/all',
    type: 'GET'
  });
  return response.json();
};
