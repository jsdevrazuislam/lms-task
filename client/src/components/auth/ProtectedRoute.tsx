"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { UserRole } from "@/features/auth/types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isInitialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // No client-side redirect logic here as it's handled by middleware
    // This component only handles unauthorized role access or localized loading UI
    if (isInitialized && isAuthenticated) {
      if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        router.replace("/unauthorized");
      }
    }
  }, [isAuthenticated, isInitialized, user, allowedRoles, router]);

  if (!isInitialized) {
    return (
      <div className="flex h-[70vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
          <p className="text-xs font-semibold text-muted-foreground animate-pulse uppercase tracking-widest">
            Authenticating...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;
  if (allowedRoles && user && !allowedRoles.includes(user.role)) return null;

  return <>{children}</>;
}
