"use client";

import {
  User,
  Users as UsersIcon,
  Search,
  Filter,
  UserCog,
  UserX,
  UserCheck,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { DataTable, Column } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useSuperAdminUsers,
  useToggleUserStatus,
  useDeleteUser,
} from "@/features/super-admin/hooks/useSuperAdmin";
import { ISuperAdminUser } from "@/features/super-admin/types";

export default function UserDirectoryPage() {
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { data: response, isLoading } = useSuperAdminUsers({
    role: roleFilter === "all" ? undefined : roleFilter,
    page: currentPage,
    limit: pageSize,
  });

  const { mutate: toggleStatus } = useToggleUserStatus();
  const { mutate: deleteUser } = useDeleteUser();

  const columns: Column<ISuperAdminUser>[] = [
    {
      header: "User",
      render: (user: ISuperAdminUser) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </div>
          <span className="font-medium text-foreground">
            {user.firstName} {user.lastName}
          </span>
        </div>
      ),
    },
    {
      header: "Role",
      render: (user: ISuperAdminUser) => (
        <Badge variant="secondary" className="capitalize font-medium">
          {user.role.toLowerCase()}
        </Badge>
      ),
    },
    {
      header: "Email",
      accessor: "email",
      className: "text-muted-foreground",
    },
    {
      header: "Status",
      render: (user: ISuperAdminUser) => (
        <Badge
          variant="outline"
          className={`${
            user.isActive
              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
              : "bg-red-50 text-red-600 border-red-100"
          } font-medium space-x-1`}
        >
          <div
            className={`w-1.5 h-1.5 rounded-full ${
              user.isActive ? "bg-emerald-500 animate-pulse" : "bg-red-500"
            }`}
          />
          <span>{user.isActive ? "Active" : "Inactive"}</span>
        </Badge>
      ),
    },
    {
      header: "Join Date",
      render: (user: ISuperAdminUser) => (
        <span className="text-sm font-medium">
          {new Date(user.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: "Actions",
      thClassName: "text-right",
      className: "text-right",
      render: (user: ISuperAdminUser) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <UserCog className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-xl p-2">
            <DropdownMenuItem
              className="rounded-lg gap-2 cursor-pointer font-medium"
              onClick={() =>
                toggleStatus({ id: user.id, isActive: !user.isActive })
              }
            >
              {user.isActive ? (
                <>
                  <UserX className="w-4 h-4 text-orange-500" />
                  Deactivate User
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4 text-emerald-500" />
                  Activate User
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="rounded-lg gap-2 cursor-pointer font-medium text-destructive focus:text-destructive"
              onClick={() => {
                if (
                  confirm("Are you sure you want to delete this user forever?")
                ) {
                  deleteUser(user.id);
                }
              }}
            >
              <Trash2 className="w-4 h-4" />
              Delete Permanently
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-linear-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            User Directory
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Ultimate oversight over platform participants.
          </p>
        </div>
      </div>

      <Card className="border-none shadow-xl-theme bg-card/50 backdrop-blur-sm overflow-hidden rounded-3xl">
        <div className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-96 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                className="pl-10 h-11 bg-background/50 border-border focus:ring-primary/20 rounded-xl"
                placeholder="Search by name or email..."
              />
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select
                value={roleFilter}
                onValueChange={(val) => {
                  setRoleFilter(val);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[180px] h-11 bg-background/50 rounded-xl">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent className="rounded-xl shadow-xl">
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="STUDENT">Students</SelectItem>
                  <SelectItem value="INSTRUCTOR">Instructors</SelectItem>
                  <SelectItem value="ADMIN">Admins</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={response?.data || []}
            isLoading={isLoading}
            emptyState={{
              icon: UsersIcon,
              title: "No users found",
              description: "Try adjusting your filters or search criteria.",
            }}
            pagination={
              response?.meta
                ? {
                    totalItems: response.meta.total,
                    pageSize: response.meta.limit,
                    currentPage: response.meta.page,
                    onPageChange: setCurrentPage,
                  }
                : undefined
            }
          />
        </div>
      </Card>
    </div>
  );
}
