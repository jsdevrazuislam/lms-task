import { Bell, Sun, Moon, ChevronDown, BookOpen, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import React from "react";
import { MobileSidebar } from "@/components/layout/Sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { cn } from "@/lib/utils";

import { NavUserSkeleton } from "../shared/SkeletonLoader";

export function TopNavbar() {
  const { user, logout, isLoading } = useAuth();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-xl px-4 flex items-center justify-between sticky top-0 z-30 shrink-0">
      {/* Mobile menu trigger */}
      <div className="md:hidden flex items-center gap-3">
        <MobileSidebar
          role={
            (user?.role?.toLowerCase() as
              | "student"
              | "instructor"
              | "admin"
              | "super_admin") || "student"
          }
        />
        <div className="w-8 h-8 rounded-lg bg-primary-muted flex items-center justify-center">
          <BookOpen className="w-4 h-4 text-primary" />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center ml-auto gap-2 sm:gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl hover:bg-muted text-muted-foreground transition-colors"
          aria-label="Toggle theme"
        >
          {theme === "light" ? (
            <Moon className="w-5 h-5" />
          ) : (
            <Sun className="w-5 h-5" />
          )}
        </button>

        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="relative p-2 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground transition-all hover:bg-muted group">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full border-2 border-background" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-80 p-0 rounded-2xl border-border shadow-elevated overflow-hidden"
            align="end"
          >
            <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
              <h4 className="font-semibold text-sm">Notifications</h4>
              <button className="text-xs text-primary hover:underline font-medium">
                Mark all as read
              </button>
            </div>
            <ScrollArea className="h-[300px]">
              <div className="divide-y divide-border">
                {[
                  {
                    id: 1,
                    title: "New Course Available",
                    desc: "Build a Modern LMS with Next.js is now live!",
                    time: "2m ago",
                    unread: true,
                  },
                  {
                    id: 2,
                    title: "Assignment Graded",
                    desc: "Your submission for Module 2 has been graded.",
                    time: "1h ago",
                    unread: true,
                  },
                  {
                    id: 3,
                    title: "Welcome to LearnFlow",
                    desc: "Start your learning journey today with our top courses.",
                    time: "2h ago",
                    unread: false,
                  },
                ].map((n) => (
                  <div
                    key={n.id}
                    className={cn(
                      "p-4 hover:bg-muted/50 transition-colors cursor-pointer relative",
                      n.unread && "bg-primary/5",
                    )}
                  >
                    {n.unread && (
                      <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full" />
                    )}
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-sm font-semibold">{n.title}</p>
                      <span className="text-[10px] text-muted-foreground">
                        {n.time}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {n.desc}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="p-2 border-t border-border bg-muted/30">
              <button className="w-full py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
                View all notifications
              </button>
            </div>
          </PopoverContent>
        </Popover>

        <div className="h-8 w-px bg-border mx-1" />

        {/* User Profile Dropdown or Skeleton */}
        {isLoading ? (
          <NavUserSkeleton />
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 p-1 rounded-xl hover:bg-muted transition-all group outline-none">
                <Avatar className="h-9 w-9 border-2 border-background shadow-sm ring-1 ring-border">
                  <AvatarImage src={user?.avatarUrl} alt={user?.firstName} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs uppercase">
                    {user ? `${user.firstName[0]}${user.lastName[0]}` : "CN"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden lg:block text-left mr-1">
                  <p className="text-xs font-bold text-foreground leading-tight">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-[10px] text-muted-foreground leading-tight uppercase font-semibold mt-0.5">
                    {user?.role.replace("_", " ")}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-64 p-2 rounded-2xl shadow-elevated border-border z-50"
            >
              <div className="px-3 py-4 flex flex-col gap-1 border-b border-border mb-2">
                <p className="text-sm font-bold text-foreground">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
              <DropdownMenuItem
                onClick={() => logout()}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-bold">Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
