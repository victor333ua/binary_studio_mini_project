import * as authService from 'src/services/authService';
import { GET_USER_REJECTED,
  SET_USER, USER_LOADING, USER_LOGOUT, RESET_ERROR, SET_USERS, SET_ROLE } from './actionTypes';
import * as userService from '../../services/userService';

const setToken = token => localStorage.setItem('token', token);

export const resetError = () => ({ type: RESET_ERROR });

const setUser = user => ({
  type: SET_USER,
  user
});

const userLoading = () => ({
  type: USER_LOADING
});

const userRejected = error => ({
  type: GET_USER_REJECTED,
  error
});

const handleAuthResponse = authResponsePromise => async dispatch => {
  dispatch(userLoading());
  try {
    const { user, token } = await authResponsePromise;
    setToken(token);
    dispatch(setUser(user));
  } catch (err) {
    dispatch(userRejected(err));
  }
};

export const login = request => handleAuthResponse(authService.login(request));
export const register = request => handleAuthResponse(authService.registration(request));

export const logout = () => {
  setToken('');
  return ({ type: USER_LOGOUT });
};

// export const loadCurrentUser = () => async dispatch => {
//   const user = await authService.getCurrentUser();
//   dispatch(setUser(user));

export const saveUser = user => async dispatch => {
  dispatch(userLoading());
  await userService.save(user);
  dispatch(setUser(user));
};

export const loadUsers = () => async dispatch => {
  dispatch(userLoading());
  try {
    const [users, roles] = await Promise.all([userService.getAll(), userService.getRoles()]);
    dispatch({
      type: SET_USERS,
      payload: { users, roles }
    });
  } catch (err) {
    dispatch(userRejected(err));
  }
};

export const saveRole = (user, role) => async dispatch => {
  await userService.save({ ...user, roles: [role] });
  dispatch({
    type: SET_ROLE,
    payload: { userId: user.id, role }
  });
};
