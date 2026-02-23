"use client";
import { Menu, X, Sun, Moon } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import React, { useState } from "react";
import { LearnFlowLogo } from "@/components/shared/LearnFlowLogo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/features/auth/hooks/useAuth";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated, isInitialized, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const getDashboardPath = (role?: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "/dashboard/super-admin";
      case "ADMIN":
        return "/dashboard/admin";
      case "INSTRUCTOR":
        return "/dashboard/instructor";
      case "STUDENT":
        return "/dashboard/student";
      default:
        return "/dashboard";
    }
  };

  const userInitials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : "??";

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <LearnFlowLogo />

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          {["Courses"].map((item) => (
            <Link
              key={item}
              href={item === "Courses" ? "/courses" : "#"}
              className="text-sm text-muted-foreground hover:text-foreground font-medium transition-colors"
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Auth / Profile / Theme */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 mr-2 rounded-xl hover:bg-muted text-muted-foreground transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>

          {!isInitialized ? (
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-16 rounded-lg" />
              <Skeleton className="h-10 w-24 rounded-lg" />
            </div>
          ) : !isAuthenticated ? (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="btn-primary text-sm px-4 py-2 rounded-lg bg-gradient-primary text-white font-semibold hover:opacity-90 transition-opacity shadow-primary"
              >
                Start Free
              </Link>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-auto flex items-center gap-3 px-2 hover:bg-muted/50 rounded-full transition-all"
                >
                  <div className="flex-col items-end hidden lg:flex">
                    <span className="text-sm font-bold text-foreground leading-none">
                      {user?.firstName} {user?.lastName}
                    </span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mt-0.5">
                      {user?.role.replace("_", " ")}
                    </span>
                  </div>
                  <Avatar className="h-9 w-9 border-2 border-background shadow-sm ring-1 ring-border">
                    <AvatarImage src={user?.avatarUrl} alt={user?.firstName} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
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
                <DropdownMenuItem asChild>
                  <Link
                    href={getDashboardPath(user?.role)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-muted transition-colors"
                  >
                    <span className="text-sm font-medium">My Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-2 bg-border h-px -mx-2" />
                <DropdownMenuItem
                  onClick={() => logout()}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 transition-colors"
                >
                  <span className="text-sm font-bold">Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 py-4 space-y-3 animate-fade-in">
          {isAuthenticated && (
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-2xl mb-4 border border-border">
              <Avatar className="h-10 w-10 ring-1 ring-border">
                <AvatarImage src={user?.avatarUrl} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-sm font-bold text-foreground truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-muted-foreground truncate uppercase tracking-tighter">
                  {user?.role.replace("_", " ")}
                </p>
              </div>
            </div>
          )}

          {["Courses", "Pricing", "Enterprise", "Blog"].map((item) => (
            <Link
              key={item}
              href={item === "Courses" ? "/courses" : "#"}
              className="block text-sm font-medium text-muted-foreground hover:text-foreground py-2 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {item}
            </Link>
          ))}

          <div className="pt-2 border-t border-border flex flex-col gap-2">
            <button
              onClick={toggleTheme}
              className="flex items-center justify-between px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
              {theme === "light" ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </button>
            {!isAuthenticated ? (
              <>
                <Link
                  href="/login"
                  className="text-center text-sm font-medium text-muted-foreground py-2"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="text-center text-sm font-semibold bg-gradient-primary text-white rounded-xl py-2.5 shadow-primary"
                  onClick={() => setMenuOpen(false)}
                >
                  Start Free
                </Link>
              </>
            ) : (
              <>
                <Link
                  href={getDashboardPath(user?.role)}
                  className="text-center text-sm font-semibold bg-primary text-primary-foreground rounded-xl py-2.5"
                  onClick={() => setMenuOpen(false)}
                >
                  My Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="text-center text-sm font-medium text-destructive py-2"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
