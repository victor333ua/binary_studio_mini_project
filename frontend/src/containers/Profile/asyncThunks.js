import { createAsyncThunk } from '@reduxjs/toolkit';
import * as authService from 'src/services/authService';
import * as userService from '../../services/userService';

export const handleAuthResponse = createAsyncThunk(
  'profile/authorize',
  async ({ isLogin, data }) => {
    const { user, token } = isLogin
      ? await authService.login(data)
      : await authService.registration(data);
    localStorage.setItem('token', token);
    return { user };
  }
);
export const login = data => handleAuthResponse({ isLogin: true, data });
export const register = data => handleAuthResponse({ isLogin: false, data });

export const saveUser = createAsyncThunk(
  'profile/authorize', // here we have the same action in slice as above
  async user => {
    await userService.save(user);
    return { user };
  }
);
export const loadUsers = createAsyncThunk(
  'profile/loadUsers',
  async () => {
    const [users, roles] = await Promise.all(
      [userService.getAll(), userService.getRoles()]
    );
    return { users, roles };
  }
);

export const saveRole = createAsyncThunk(
  'profile/saveRole',
  async ({ user, role }) => {
    await userService.save({ ...user, roles: [role] });
    return { userId: user.id, role };
  }
);
