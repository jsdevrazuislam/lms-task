"use client";
import { useRouter } from "@bprogress/next";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { UserRole } from "@/features/auth/types";
import { useAppSelector } from "@/store";

const AdminDashboard = dynamic(() => import("./admin/page"), { ssr: false });
const InstructorDashboard = dynamic(() => import("./instructor/page"), {
  ssr: false,
});
const StudentDashboard = dynamic(() => import("./student/page"), {
  ssr: false,
});
const SuperAdminDashboard = dynamic(() => import("./super-admin/page"), {
  ssr: false,
});

export default function DashboardRootPage() {
  const { user, isLoading } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.replace("/login");
        return;
      }

      // Sync URL with role-based path for deep-linking consistency
      const currentPath = window.location.pathname;
      const targetPath = (
        user.role === UserRole.SUPER_ADMIN
          ? "/dashboard/super-admin"
          : user.role === UserRole.ADMIN
            ? "/dashboard/admin"
            : user.role === UserRole.INSTRUCTOR
              ? "/dashboard/instructor"
              : user.role === UserRole.STUDENT
                ? "/dashboard/student"
                : "/"
      ) as string;

      if (currentPath === "/dashboard") {
        router.replace(targetPath);
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-6 max-w-xs text-center animate-in fade-in zoom-in duration-500">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 rounded-lg border-2 border-primary border-t-transparent animate-spin" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Welcome Back</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Preparing your dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // Render immediately while redirect is in-flight for zero-latency feel
  switch (user.role) {
    case UserRole.SUPER_ADMIN:
      return <SuperAdminDashboard />;
    case UserRole.ADMIN:
      return <AdminDashboard />;
    case UserRole.INSTRUCTOR:
      return <InstructorDashboard />;
    case UserRole.STUDENT:
      return <StudentDashboard />;
    default:
      return null;
  }
}
