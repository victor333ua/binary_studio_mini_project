import callWebApi from '../helpers/webApiHelper';

export const save = async user => {
  await callWebApi({
    endpoint: '/api/user',
    type: 'PUT',
    request: user
  });
};
