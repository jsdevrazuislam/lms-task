"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppSelector } from "@/store";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export const RoleGuard = ({ children, allowedRoles }: RoleGuardProps) => {
  const { user, isAuthenticated, isLoading } = useAppSelector(
    (state) => state.auth,
  );
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (user && !allowedRoles.includes(user.role)) {
        // Redirect based on their actual role
        switch (user.role) {
          case "STUDENT":
            router.push("/dashboard/student");
            break;
          case "INSTRUCTOR":
            router.push("/dashboard/instructor");
            break;
          case "SUPER_ADMIN":
          case "ADMIN":
            router.push("/dashboard/admin");
            break;
          default:
            router.push("/");
        }
      }
    }
  }, [user, isAuthenticated, isLoading, allowedRoles, router]);

  if (isLoading) {
    return (
      <div className="p-8 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!isAuthenticated || (user && !allowedRoles.includes(user.role))) {
    return null;
  }

  return <>{children}</>;
};
