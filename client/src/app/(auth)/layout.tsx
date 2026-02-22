"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppSelector } from "@/store";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isInitialized, user } = useAppSelector(
    (state) => state.auth,
  );
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && isAuthenticated && user) {
      const role = user.role;
      switch (role) {
        case "SUPER_ADMIN":
          router.replace("/dashboard/super-admin");
          break;
        case "ADMIN":
          router.replace("/dashboard/admin");
          break;
        case "INSTRUCTOR":
          router.replace("/dashboard/instructor");
          break;
        case "STUDENT":
          router.replace("/dashboard/student");
          break;
        default:
          router.replace("/dashboard");
      }
    }
  }, [isAuthenticated, isInitialized, user, router]);

  if (!isInitialized || isAuthenticated) {
    return null; // Don't show auth forms while checking or if already auth'd
  }

  return <div className="min-h-screen bg-background">{children}</div>;
}
