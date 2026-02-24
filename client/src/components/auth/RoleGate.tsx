"use client";
import { useRouter } from "@bprogress/next";
import { ReactNode, useEffect } from "react";
import { UserRole } from "@/features/auth/types";
import { useAppSelector } from "@/store";

import { DashboardContentSkeleton } from "../shared/SkeletonLoader";

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
        router.push("/dashboard");
      }
    }
  }, [user, isLoading, isAuthenticated, allowedRoles, router]);

  if (isLoading) {
    return <DashboardContentSkeleton />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}
