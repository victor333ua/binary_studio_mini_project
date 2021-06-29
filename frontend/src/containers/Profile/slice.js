import { createSlice } from '@reduxjs/toolkit';
import { handleAuthResponse, loadUsers, saveRole } from './asyncThunks';

const initialState = {
  isAuthorized: false,
  status: 'idle',
  user: {}
};

const setError = (state, action) => {
  state.status = 'error';
  state.error = action.error;
};

const setPending = state => {
  state.status = 'loading';
  state.error = null;
};

const usersSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    userLogout(state) {
      state.status = 'idle';
      state.user = {};
      state.isAuthorized = false;
    },
    profileLoading: setPending,
    profileRejected: setError,
    profileResetError(state) {
      state.error = null;
      state.status = 'idle';
    }
  },
  extraReducers: {
    [handleAuthResponse.pending]: setPending,
    [handleAuthResponse.rejected]: setError,
    [handleAuthResponse.fulfilled]: (state, action) => {
      const { user } = action.payload;
      state.user = user;
      state.isAuthorized = Boolean(user?.id);
      state.status = 'completed';
    },

    [loadUsers.pending]: setPending,
    [loadUsers.rejected]: setError,
    [loadUsers.fulfilled]: (state, action) => {
      state.users = action.payload.users;
      state.roles = action.payload.roles;
      state.status = 'completed';
    },

    [saveRole.pending]: setPending,
    [saveRole.rejected]: setError,
    [saveRole.fulfilled]: (state, action) => {
      const { userId, role } = action.payload;
      const index = state.users.findIndex(user => user.id === userId);
      const updatedUser = {
        ...state.users[index],
        roles: [role]
      };
      state.users.splice(index, 1, updatedUser);
      state.status = 'completed';
    }
  }
});
export const getCurrentUser = state => state.profile.user;
export const getPostsError = state => state.posts.error;
export const getPostsStatus = state => state.posts.status;

export const { userLogout, profileLoading, profileRejected, profileResetError } = usersSlice.actions;
export default usersSlice.reducer;
