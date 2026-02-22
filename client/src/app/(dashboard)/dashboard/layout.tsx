"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAppSelector } from "@/store";

export default function GlobalDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user, isLoading, isInitialized, isAuthenticated } = useAppSelector(
    (state) => state.auth,
  );
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isInitialized, isAuthenticated, router]);

  if (isLoading || !isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-6 max-w-xs text-center animate-in fade-in zoom-in duration-500">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 rounded-lg border-2 border-primary border-t-transparent animate-spin" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !isAuthenticated) return null;

  return <DashboardLayout role={user.role}>{children}</DashboardLayout>;
}
