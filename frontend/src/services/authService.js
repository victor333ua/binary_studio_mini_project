import callWebApi from 'src/helpers/webApiHelper';

const authenticate = logreg => async request => {
  const response = await callWebApi({
    endpoint: `/api/auth/${logreg}`,
    type: 'POST',
    skipAuthorization: true,
    request
  });
  return response.json();
};

export const login = authenticate('login');
export const registration = authenticate('register');

export const getCurrentUser = async () => {
  try {
    const response = await callWebApi({
      endpoint: '/api/user',
      type: 'GET'
    });
    return response.json();
  } catch (e) {
    return null;
  }
};
