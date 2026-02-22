import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store";
import { addNotification } from "@/store/slices/notificationSlice";

/**
 * Custom hook to manage Socket.io connection globally
 */
export const useSocket = () => {
  const dispatch = useAppDispatch();
  const { token, isAuthenticated } = useAppSelector((state) => state.auth);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Only connect if authenticated and token exists
    if (!isAuthenticated || !token) {
      return;
    }

    const s = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000", {
      auth: {
        token,
      },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Use a timeout to avoid synchronous setState during effect execution
    const timer = setTimeout(() => {
      setSocket(s);
    }, 0);

    s.on("connect", () => {
      console.log("connected to socket server");
    });

    s.on("notification", (notification) => {
      // Add to Redux state
      dispatch(addNotification(notification));

      // Show toast for visible feedback
      toast.info(notification.title, {
        description: notification.message,
      });
    });

    s.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    s.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    return () => {
      clearTimeout(timer);
      s.disconnect();
      setSocket(null);
    };
  }, [isAuthenticated, token, dispatch]);

  return socket;
};
