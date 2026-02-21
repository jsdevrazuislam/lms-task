"use client";

import {
  Search,
  MoreHorizontal,
  Shield,
  User as UserIcon,
  Trash2,
  Filter,
  Mail,
  Calendar,
  RefreshCcw,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { DataTable } from "@/components/shared/DataTable";
import ErrorBoundary from "@/components/shared/ErrorBoundary";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useUsers } from "@/features/admin/hooks/useUsers";
import { User, UserRole } from "@/features/admin/services/user.service";

interface RoleConfig {
  label: string;
  color: string;
  icon: React.ElementType;
}

const roleBadge: Record<UserRole | "SUPER_ADMIN", RoleConfig> = {
  SUPER_ADMIN: {
    label: "Super Admin",
    color: "bg-warning-muted text-warning border-warning/20",
    icon: Shield,
  },
  ADMIN: {
    label: "Admin",
    color: "bg-destructive-muted text-destructive border-destructive/20",
    icon: Shield,
  },
  INSTRUCTOR: {
    label: "Instructor",
    color: "bg-primary-muted text-primary border-primary/20",
    icon: Shield,
  },
  STUDENT: {
    label: "Student",
    color: "bg-accent-muted text-accent border-accent/20",
    icon: UserIcon,
  },
};

const AdminUsers = () => {
  const {
    users,
    meta,
    isLoading,
    error,
    filters,
    setFilters,
    handleUpdateRole,
    handleDeleteUser,
    refetch,
  } = useUsers();

  const [search, setSearch] = useState("");
  const [confirmAction, setConfirmAction] = useState<{
    id: string;
    type: "delete";
  } | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, searchTerm: search, page: 1 }));
  };

  const columns = [
    {
      header: "User",
      render: (u: User) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-border">
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {u.firstName[0]}
              {u.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-sm text-foreground truncate">
              {u.firstName} {u.lastName}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground truncate">
              <Mail className="w-3 h-3" />
              {u.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Role",
      render: (u: User) => {
        const badge = roleBadge[u.role] || roleBadge.STUDENT;
        const Icon = badge.icon;
        return (
          <Badge
            variant="outline"
            className={`gap-1 px-2 py-0.5 font-bold tracking-tight border-none ${badge.color}`}
          >
            <Icon className="w-3 h-3" />
            {badge.label}
          </Badge>
        );
      },
    },
    {
      header: "Join Date",
      render: (u: User) => (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
          <Calendar className="w-3.5 h-3.5" />
          {new Date(u.createdAt).toLocaleDateString()}
        </div>
      ),
    },
    {
      header: "",
      className: "w-12",
      render: (u: User) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg hover:bg-muted"
            >
              <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
              Change Role
            </div>
            {(["STUDENT", "INSTRUCTOR", "ADMIN"] as UserRole[]).map((role) => (
              <DropdownMenuItem
                key={role}
                onClick={() => handleUpdateRole(u.id, role)}
                className="gap-2 cursor-pointer"
                disabled={u.role === role}
              >
                {role.charAt(0) + role.slice(1).toLowerCase()}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setConfirmAction({ id: u.id, type: "delete" })}
              className="gap-2 cursor-pointer text-destructive focus:text-destructive"
            >
              <Trash2 className="w-4 h-4" /> Delete Account
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertCircle className="w-12 h-12 text-destructive" />
        <div className="text-center">
          <h2 className="text-xl font-bold">Error Loading Users</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
        <Button onClick={() => refetch()} variant="outline" className="gap-2">
          <RefreshCcw className="w-4 h-4" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="space-y-8 animate-fade-in">
        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold tracking-tight">
              User Management
            </h1>
            <p className="text-muted-foreground">
              Monitor user activity, manage roles, and handle account status.
            </p>
          </div>
          <Button
            onClick={() => refetch()}
            variant="ghost"
            size="sm"
            className="gap-2"
            disabled={isLoading}
          >
            <RefreshCcw
              className={isLoading ? "animate-spin w-4 h-4" : "w-4 h-4"}
            />
            Refresh
          </Button>
        </div>

        <Card className="border-border overflow-hidden">
          <CardContent className="p-4 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <form onSubmit={handleSearch} className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-10 rounded-xl"
                />
              </form>
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="gap-2 h-10 rounded-xl border-border"
                    >
                      <Filter className="w-4 h-4" />
                      {filters.role
                        ? filters.role.charAt(0) +
                          filters.role.slice(1).toLowerCase()
                        : "All Roles"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          role: undefined,
                          page: 1,
                        }))
                      }
                    >
                      All Roles
                    </DropdownMenuItem>
                    {(["STUDENT", "INSTRUCTOR", "ADMIN"] as const).map((r) => (
                      <DropdownMenuItem
                        key={r}
                        onClick={() =>
                          setFilters((prev) => ({
                            ...prev,
                            role: r as UserRole,
                            page: 1,
                          }))
                        }
                      >
                        {r.charAt(0) + r.slice(1).toLowerCase()}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>

        <DataTable
          columns={columns}
          data={users}
          isLoading={isLoading}
          pagination={{
            totalItems: meta.total,
            pageSize: meta.limit,
            currentPage: meta.page,
            onPageChange: (page) => setFilters((prev) => ({ ...prev, page })),
          }}
          emptyState={{
            icon: UserIcon,
            title: "No users found",
            description: "No users match your current search criteria.",
          }}
        />

        <AlertDialog
          open={!!confirmAction}
          onOpenChange={(open) => !open && setConfirmAction(null)}
        >
          <AlertDialogContent className="rounded-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-bold">
                Delete user account?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground">
                This action is permanent and cannot be undone. All user data,
                enrollments, and progress will be removed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-xl">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  confirmAction && handleDeleteUser(confirmAction.id)
                }
                className="rounded-xl text-white bg-destructive hover:bg-destructive/90"
              >
                Delete Account
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </ErrorBoundary>
  );
};

export default AdminUsers;
