"use client";

import { useSocket } from "@/hooks/useSocket";

export function SocketInitializer({ children }: { children: React.ReactNode }) {
  useSocket();
  return <>{children}</>;
}
