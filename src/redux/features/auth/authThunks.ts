// src/redux/features/auth/authThunks.ts

import { createAsyncThunk } from "@reduxjs/toolkit";
import { setUser, logout, setLoading } from "./authSlice";
import { getBaseUrl } from "@/utils/getBaseUrl";

export const silentRefresh = createAsyncThunk(
  "auth/silentRefresh",
  async (_, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      // 1 refresh access token (cookie based)
      const refreshRes = await fetch(
        `${getBaseUrl()}/api/v1/auth/refresh-token`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (!refreshRes.ok) {
        throw new Error("Refresh failed");
      }
      // 2 restore user from localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        dispatch(setUser(JSON.parse(storedUser)));
      }
    } catch {
      dispatch(logout());
    } finally {
      dispatch(setLoading(false));
    }
  }
);
