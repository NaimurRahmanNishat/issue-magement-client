import { configureStore } from '@reduxjs/toolkit'
import authReducer from './features/auth/authSlice';
import notificationReducer from './features/emergency/notificationSlice';
import { baseApi } from './api/baseApi';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
    notification: notificationReducer,
  },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
})

// Get the type of our store variable
export type AppStore = typeof store
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = AppStore['dispatch']