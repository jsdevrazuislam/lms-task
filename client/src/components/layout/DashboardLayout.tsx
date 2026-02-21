import { ReactNode } from "react";
import { RoleGate } from "@/components/auth/RoleGate";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNavbar } from "@/components/layout/TopNavbar";
import { UserRole } from "@/features/auth/types";

interface DashboardLayoutProps {
  children: ReactNode;
  role: UserRole;
}

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const roleSlug = role.toLowerCase() as
    | "super-admin"
    | "admin"
    | "instructor"
    | "student";

  return (
    <RoleGate allowedRoles={[role]}>
      <div className="flex h-screen bg-background overflow-hidden">
        <Sidebar role={roleSlug} />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <TopNavbar />
          <main className="flex-1 overflow-y-auto scrollbar-thin p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </RoleGate>
  );
}
