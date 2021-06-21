import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './containers/Profile/slice';
import postsReducer from './containers/Thread/slice';

export default configureStore({
  reducer: {
    profile: usersReducer,
    posts: postsReducer
  }
});
