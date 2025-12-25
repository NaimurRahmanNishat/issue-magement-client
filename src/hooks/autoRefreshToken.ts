// src/hooks/useAutoRefreshToken.ts
import { useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import type { RootState } from "@/redux/store";
import { useRefreshTokenMutation } from "@/redux/features/auth/authApi";

export const useAutoRefreshToken = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [refreshToken] = useRefreshTokenMutation();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isAuthenticated && user?._id) {
      console.log("✅ User authenticated, setting up token refresh");

      // Immediate refresh
      refreshToken({ userId: user._id })
        .unwrap()
        .then(() => console.log("✅ Token refreshed successfully"))
        .catch((error) => console.error("Token refresh failed:", error));

      // Set interval to refresh token (9 minute)
      intervalRef.current = setInterval(() => {
        console.log("🔄 Refreshing token...");
        refreshToken({ userId: user._id })
          .unwrap()
          .then(() => console.log("✅ Token refreshed"))
          .catch((error) => console.error("Token refresh error:", error));
      }, 50 * 1000);  // 50 seconds for testing

      // Cleanup when user logs out or unmounts
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          console.log("🧹 Token refresh interval cleared");
        }
      };
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        console.log("🔴 User logged out, token refresh stopped");
      }
    }
  }, [isAuthenticated, user?._id, refreshToken]);
};
