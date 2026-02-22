"use client";

import {
  LayoutDashboard,
  PlayCircle,
  Settings,
  LogOut,
  Menu,
  Users,
  Layers,
  TrendingUp,
  GraduationCap,
  BookMarked,
  Award,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { LearnFlowLogo } from "@/components/shared/LearnFlowLogo";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: Record<string, NavGroup[]> = {
  super_admin: [
    {
      title: "Overview",
      items: [
        {
          label: "Dashboard",
          icon: LayoutDashboard,
          path: "/dashboard/super-admin",
        },
        {
          label: "Analytics",
          icon: TrendingUp,
          path: "/dashboard/super-admin/analytics",
        },
      ],
    },
    {
      title: "Management",
      items: [
        { label: "Users", icon: Users, path: "/dashboard/super-admin/users" },
        {
          label: "Admins",
          icon: GraduationCap,
          path: "/dashboard/super-admin/admins",
        },
        {
          label: "Courses",
          icon: BookMarked,
          path: "/dashboard/super-admin/courses",
        },
      ],
    },
    {
      title: "System",
      items: [
        {
          label: "Platform Settings",
          icon: Settings,
          path: "/dashboard/super-admin/settings",
        },
      ],
    },
  ],
  admin: [
    {
      title: "Overview",
      items: [
        { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard/admin" },
        {
          label: "Analytics",
          icon: TrendingUp,
          path: "/dashboard/admin/analytics",
        },
      ],
    },
    {
      title: "Content",
      items: [
        {
          label: "Courses",
          icon: BookMarked,
          path: "/dashboard/admin/courses",
        },
        {
          label: "Categories",
          icon: Layers,
          path: "/dashboard/admin/categories",
        },
      ],
    },
    {
      title: "User Management",
      items: [
        { label: "All Users", icon: Users, path: "/dashboard/admin/users" },
      ],
    },
  ],
  instructor: [
    {
      title: "Overview",
      items: [
        {
          label: "Dashboard",
          icon: LayoutDashboard,
          path: "/dashboard/instructor",
        },
        {
          label: "Analytics",
          icon: TrendingUp,
          path: "/dashboard/instructor/analytics",
        },
        {
          label: "Revenue",
          icon: TrendingUp,
          path: "/dashboard/instructor/revenue",
        },
      ],
    },
    {
      title: "Content",
      items: [
        {
          label: "My Courses",
          icon: BookMarked,
          path: "/dashboard/instructor/courses",
        },
      ],
    },
    {
      title: "Engagement",
      items: [
        {
          label: "Students",
          icon: Users,
          path: "/dashboard/instructor/students",
        },
      ],
    },
  ],
  student: [
    {
      title: "Learning",
      items: [
        {
          label: "Dashboard",
          icon: LayoutDashboard,
          path: "/dashboard/student",
        },
        {
          label: "My Courses",
          icon: PlayCircle,
          path: "/dashboard/student/courses",
        },
      ],
    },
    {
      title: "Achievements",
      items: [
        {
          label: "Certificates",
          icon: Award,
          path: "/dashboard/student/certificates",
        },
        {
          label: "Progress",
          icon: TrendingUp,
          path: "/dashboard/student/progress",
        },
      ],
    },
  ],
};

interface SidebarProps {
  role: "super_admin" | "admin" | "instructor" | "student";
}

const roleLabels: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Administrator",
  instructor: "Instructor",
  student: "Student",
};

const roleColors: Record<string, string> = {
  super_admin: "badge-destructive",
  admin: "badge-accent",
  instructor: "badge-primary",
  student: "badge-success",
};

const getDashboardPath = (role: string) => {
  switch (role) {
    case "super-admin":
      return "/dashboard/super-admin";
    case "admin":
      return "/dashboard/admin";
    case "instructor":
      return "/dashboard/instructor";
    case "student":
      return "/dashboard/student";
    default:
      return "/dashboard";
  }
};

function SidebarNav({
  role,
  collapsed = false,
  onNavClick,
}: {
  role: "super_admin" | "admin" | "instructor" | "student";
  collapsed?: boolean;
  onNavClick?: () => void;
}) {
  const location = usePathname();
  const navigate = useRouter();
  const groups = navGroups[role] || navGroups["student"];

  return (
    <>
      <div className="h-16 flex items-center px-4 border-b border-sidebar-border shrink-0">
        <LearnFlowLogo
          textClassName={collapsed ? "hidden" : "block"}
          href={getDashboardPath(role)}
        />
      </div>

      {!collapsed && (
        <div className="px-4 py-3 border-b border-sidebar-border shrink-0">
          <span className={`${roleColors[role]} text-xs`}>
            {roleLabels[role]}
          </span>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto scrollbar-thin py-3">
        {groups.map((group) => (
          <div key={group.title} className="mb-4">
            {!collapsed && (
              <p className="text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40 px-4 mb-1">
                {group.title}
              </p>
            )}
            {group.items.map((item) => {
              const active = location === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={onNavClick}
                  className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-sm font-medium transition-all duration-150 group mb-0.5 ${
                    active
                      ? "bg-primary/20 text-primary"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  }`}
                >
                  <item.icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      active
                        ? "text-primary"
                        : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground"
                    }`}
                  />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                  {!collapsed && active && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-3 space-y-1 shrink-0">
        <button
          onClick={() => {
            navigate.push("/login");
            onNavClick?.();
          }}
          className="w-full flex cursor-pointer items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </>
  );
}

function DesktopSidebar({ role }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`hidden md:flex flex-col h-screen sticky top-0 transition-all duration-300 overflow-visible bg-sidebar border-r border-sidebar-border shrink-0 z-20 ${
        collapsed ? "w-[68px]" : "w-[240px]"
      }`}
    >
      <SidebarNav role={role} collapsed={collapsed} />

      <button
        onClick={() => setCollapsed(!collapsed)}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="absolute top-[72px] -right-4 z-40 w-8 h-8 rounded-full bg-card border-2 border-border  flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all duration-200"
      >
        {collapsed ? (
          <ChevronRight className="w-3.5 h-3.5" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5" />
        )}
      </button>
    </aside>
  );
}

function MobileSidebar({ role }: SidebarProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          aria-label="Open navigation menu"
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-foreground hover:bg-muted transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="p-0 w-[280px] bg-sidebar border-sidebar-border flex flex-col"
      >
        <SidebarNav role={role} onNavClick={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}

export function Sidebar({ role }: SidebarProps) {
  return <DesktopSidebar role={role} />;
}

export { MobileSidebar };
