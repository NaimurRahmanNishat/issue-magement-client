// src/redux/features/emergency/notificationSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface NotificationState {
  message: string[];
  count: number;
}

const initialState: NotificationState = { 
  message: [],
  count: 0 
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    incrementNotification: (state) => {
      state.count += 1;
    },
    resetNotification: (state) => {
      state.count = 0;
    },
    setNotificationCount: (state, action: PayloadAction<number>) => {
      state.count = action.payload;
    },
  },
});

export const { 
  incrementNotification, 
  resetNotification, 
  setNotificationCount 
} = notificationSlice.actions;

export default notificationSlice.reducer;