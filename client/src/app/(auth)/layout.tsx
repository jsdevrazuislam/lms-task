"use client";

import { useRouter } from "@bprogress/next";
import { Loader2 } from "lucide-react";
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 animate-in fade-in duration-500">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground animate-pulse">
            Securely redirecting to your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return <div className="min-h-screen bg-background">{children}</div>;
}
