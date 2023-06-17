import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/userSlice';

/**
 * @description - Sets up a redux store for the application with the user state managed by the 'userReducer' function.
 */
export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});
