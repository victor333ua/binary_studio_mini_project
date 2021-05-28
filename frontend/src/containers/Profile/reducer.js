import { GET_USER_REJECTED, SET_USER, USER_LOADING, USER_LOGOUT, RESET_PASSWORD, RESET_ERROR } from './actionTypes';

export default (state = {
  status: 'idle',
  isAuthorized: false,
  user: {},
  error: null
}, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.user,
        isAuthorized: Boolean(action.user?.id),
        status: 'completed',
        error: null
      };
    case USER_LOADING:
      return {
        ...state,
        status: 'loading',
        error: null
      };
    case USER_LOGOUT:
      return {
        ...state,
        status: 'idle',
        user: {},
        isAuthorized: false,
        error: null
      };
    case GET_USER_REJECTED:
      return {
        ...state,
        status: 'error',
        error: action.error.message
      };
    case RESET_PASSWORD:
      return {
        ...state,
        isPasswordResetAllowed: action.isPasswordResetAllowed
      };
    case RESET_ERROR:
      return {
        ...state,
        status: 'idle',
        error: null
      };
    default:
      return state;
  }
};
