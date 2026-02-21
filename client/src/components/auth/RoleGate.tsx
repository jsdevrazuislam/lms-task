"use client";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { UserRole } from "@/features/auth/types";
import { useAppSelector } from "@/store";

interface RoleGateProps {
  children: ReactNode;
  allowedRoles: UserRole[];
}

export function RoleGate({ children, allowedRoles }: RoleGateProps) {
  const { user, isLoading, isAuthenticated } = useAppSelector(
    (state) => state.auth,
  );
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || !user) {
        router.push("/login");
        return;
      }

      if (!allowedRoles.includes(user.role)) {
        router.push("/dashboard"); // Redirect to their own dashboard or an unauthorized page
      }
    }
  }, [user, isLoading, isAuthenticated, allowedRoles, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] animate-pulse">
        <div className="w-10 h-10 rounded-xl bg-primary-muted animate-spin border-2 border-primary border-t-transparent mb-4" />
        <p className="text-xs text-muted-foreground font-medium">
          Verifying access...
        </p>
      </div>
    );
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}
