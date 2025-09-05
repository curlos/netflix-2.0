import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/userSlice';
import { movieApi } from '../services/movieApi';
import { tvApi } from '../services/tvApi';

/**
 * @description - Sets up a redux store for the application with the user state managed by the 'userReducer' function.
 */
export const store = configureStore({
  reducer: {
    user: userReducer,
    [movieApi.reducerPath]: movieApi.reducer,
    [tvApi.reducerPath]: tvApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(movieApi.middleware, tvApi.middleware),
});
