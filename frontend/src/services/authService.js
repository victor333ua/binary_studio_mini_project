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

export const resetPassword = async email => {
  await callWebApi({
    endpoint: `/api/auth/reset?email=${email}`,
    type: 'GET',
    skipAuthorization: true
  });
};

export const changePassword = async (password, token) => {
  localStorage.setItem('reset', token);
  await callWebApi({
    endpoint: '/api/auth/password',
    type: 'PUT',
    resetPassword: true,
    request: { password }
  });
  localStorage.setItem('reset', '');
};
