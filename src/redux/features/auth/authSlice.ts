// src/redux/features/auth/authSlice.ts
import type { TAuthUser } from "@/types/authType";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  user: TAuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
}

// localStorage get user
const loadUserFromStorage = (): TAuthUser | null => {
  try {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  } catch (error) {
    console.error("Failed to load user from localStorage:", error);
    localStorage.removeItem("user");
    return null;
  }
};

const initialState: AuthState = {
  user: loadUserFromStorage(),
  isAuthenticated: !!loadUserFromStorage(),
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Set user action - with improved localStorage sync
    setUser: (state, action: PayloadAction<TAuthUser | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      if (action.payload) {
        try {
          localStorage.setItem("user", JSON.stringify(action.payload));
        } catch (error) {
          console.error("Failed to save user to localStorage:", error);
        }
      } else {
        localStorage.removeItem("user");
      }
    },
    
    // Logout
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user");
    },
    
    // Set loading
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setUser, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;