import * as authService from 'src/services/authService';
import { GET_USER_REJECTED, SET_USER, USER_LOADING, USER_LOGOUT } from './actionTypes';
import * as userService from '../../services/userService';

const setToken = token => localStorage.setItem('token', token);

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
  try {
    await userService.save(user);
  } catch (err) {
    dispatch(userRejected(err));
  }
  dispatch(setUser(user));
};
