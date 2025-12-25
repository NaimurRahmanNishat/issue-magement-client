/* eslint-disable @typescript-eslint/no-unused-vars */
// src/hooks/useSocket.ts
import { useEffect, useRef } from "react";
import { io, type Socket } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { toast } from "react-toastify";
import { getBaseUrl } from "@/utils/getBaseUrl";
import { incrementNotification } from "@/redux/features/emergency/notificationSlice";
import type { IMessage } from "@/types/message";


const API_URL = getBaseUrl() || "http://localhost:8000";

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    // if user not logged in disconnect
    if (!user) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    // Prevent multiple connections
    if (socketRef.current?.connected) {
      console.log("⚠️ Socket already connected");
      return;
    }

    const initSocket = async () => {
      try {
        // 1. Socket token fetch backend 
        const response = await fetch(`${API_URL}/api/v1/auth/socket-token`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          console.warn("Failed to get socket token");
          return;
        }

        const json = await response.json();
        const socketToken = json?.data?.socketToken;

        if (!socketToken) {
          console.warn("No socket token received");
          return;
        }

        console.log("✅ Socket token received");

        // 2. Initialize Socket Connection
        socketRef.current = io(API_URL, {
          auth: { token: socketToken },
          transports: ["websocket", "polling"],
          withCredentials: true,
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: 5,
          timeout: 20000,
        });

        const socket = socketRef.current;

        // 3. Connection Events
        socket.on("connect", () => {
          console.log("✅ Socket connected:", socket.id);
          console.log("👤 User role:", user.role);

          if (user.role === "category-admin") {
            console.log(`👨‍💼 Admin connected for category: ${user.category}`);
          }
        });

        // 4. Room Joined Confirmation
        socket.on("roomJoined", (data: { success: boolean; room: string; message: string }) => {
          console.log("🏠 Room joined:", data.room, "-", data.message);
        });

        // 5. New Emergency Message (Only for Category Admin)
        if (user.role === "category-admin") {
          socket.on("newEmergency", (payload: IMessage) => {
            console.log("🚨 New Emergency received:", payload);

            // Increment notification counter
            dispatch(incrementNotification());

            // Show toast notification
            toast.error(
              `🚨 Emergency: ${payload.message.substring(0, 60)}${
                payload.message.length > 60 ? "..." : ""
              }`,
              {
                autoClose: 8000,
                position: "top-right",
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
              }
            );

            // Optional: Play notification sound
            try {
              const audio = new Audio("/notification-sound.mp3");
              audio.play().catch((e) => console.log("Audio play failed:", e));
            } catch (e) {
              // Ignore audio errors
            }
          });
        }

        // 6. Disconnect Event
        socket.on("disconnect", (reason) => {
          console.log("❌ Socket disconnected:", reason);

          if (reason === "io server disconnect") {
            // Server disconnected, manually reconnect
            socket.connect();
          }
        });

        // 7. Connection Error
        socket.on("connect_error", (error) => {
          console.error("⚠️ Socket connection error:", error.message);

          if (error.message.includes("Authentication")) {
            console.error("🔐 Authentication failed, token might be expired");
            // Optionally trigger token refresh
          }
        });

        // 8. Reconnection Events
        socket.on("reconnect_attempt", (attemptNumber) => {
          console.log(`🔄 Reconnection attempt ${attemptNumber}...`);
        });

        socket.on("reconnect", (attemptNumber) => {
          console.log(`✅ Reconnected after ${attemptNumber} attempts`);
        });

        socket.on("reconnect_failed", () => {
          console.error("❌ Reconnection failed after all attempts");
        });

      // 9. Ping/Pong Test (Optional)
        socket.on("pong", (data: { timestamp: number }) => {
          const latency = Date.now() - data.timestamp;
          console.log(`🏓 Pong received, latency: ${latency}ms`);
        });

      } catch (error) {
        console.error("❌ Socket initialization error:", error);
      }
    };

    initSocket();

    // Cleanup Function
    return () => {
      if (socketRef.current) {
        console.log("🔌 Cleaning up socket connection");
        socketRef.current.off("connect");
        socketRef.current.off("disconnect");
        socketRef.current.off("connect_error");
        socketRef.current.off("newEmergency");
        socketRef.current.off("roomJoined");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user, dispatch]);

  return socketRef;
};