// // src/hooks/useSocket.ts
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import api from "@/api/axios";
import { getBaseUrl } from "@/utils/getBaseUrl";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

const API_URL = getBaseUrl();

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!user) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      return;
    }

    if (socketRef.current) return;

    (async () => {
      try {
        // 🔐 auto refresh handled by axios interceptor
        const { data } = await api.get("/api/v1/auth/socket-token");

        const socketToken = data?.data?.socketToken; 
        if (!socketToken) return;

        const socket = io(API_URL, {
          auth: { token: socketToken },
          withCredentials: true,
          transports: ["websocket"],
          reconnectionAttempts: 5,
        });

        socket.on("connect", () =>
          console.log("✅ Socket connected")
        );

        socket.on("connect_error", err =>
          console.error("❌ Socket error:", err.message)
        );

        socketRef.current = socket;
      } catch (err) {
        console.error("Socket init failed", err);
      }
    })();

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [user]);

  return socketRef;
};

