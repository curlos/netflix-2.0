import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import userReducer from '../features/userSlice';
import { movieApi } from '../services/movieApi';
import { tvApi } from '../services/tvApi';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user', movieApi.reducerPath, tvApi.reducerPath],
};

const rootReducer = combineReducers({
  user: userReducer,
  [movieApi.reducerPath]: movieApi.reducer,
  [tvApi.reducerPath]: tvApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

/**
 * @description - Sets up a redux store for the application with the user state managed by the 'userReducer' function.
 */
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(movieApi.middleware, tvApi.middleware),
});

export const persistor = persistStore(store);
