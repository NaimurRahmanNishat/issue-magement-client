// src/hooks/useSocket.ts
import { useEffect, useRef } from "react";
import { io, type Socket } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { toast } from "react-toastify";
import { getBaseUrl } from "@/utils/getBaseUrl";
import { incrementNotification } from "@/redux/features/emergency/notificationSlice";
import type { IMessage } from "@/types/message";
import axios from "axios";

const API_URL = getBaseUrl();

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!user) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      return;
    }

    if (socketRef.current) return; // prevent duplicate connect

    (async () => {
      try {
        // 1 Get socket token
        const { data } = await axios.get(`${API_URL}/api/v1/auth/socket-token`, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });

        const socketToken = data?.data?.socketToken;
        if (!socketToken) return;

        // 2 Connect socket
        const socket = io(API_URL, {
          auth: { token: socketToken },
          withCredentials: true,
          transports: ["websocket"],
          reconnectionAttempts: 5,
        });

        socketRef.current = socket;

        // 3 Base events
        socket.on("connect", () => console.log("✅ Socket connected:", socket.id));
        socket.on("roomJoined", ({ room }) => console.log("🏠 Joined:", room));
        socket.on("disconnect", (reason) => console.log("❌ Disconnected:", reason));
        socket.on("connect_error", (err) =>
          console.error("🔐 Socket auth failed:", err.message)
        );

        // 4 Role-based listener
        if (user.role === "category-admin") {
          socket.on("newEmergency", (msg: IMessage) => {
            dispatch(incrementNotification());
            toast.error(`🚨 Emergency: ${msg.message.slice(0, 60)}...`, {
              autoClose: 8000,
            });
            new Audio("/notification-sound.mp3").play().catch(() => {});
          });
        }
      } catch (err) {
        console.error("❌ Socket init error:", err);
      }
    })();

    // 5 Cleanup
    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [user, dispatch]);

  return socketRef;
};
