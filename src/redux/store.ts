// src/redux/store.ts

import { configureStore } from '@reduxjs/toolkit'
import { baseApi } from './api/baseApi';
import authReducer from './features/auth/authSlice';
import issueReducer from './features/issues/issueSlice';
import messageReducer from './features/message/messageSlice';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
    issue: issueReducer,
    message: messageReducer
  },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
})

// Get the type of our store variable
export type AppStore = typeof store
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = AppStore['dispatch']
