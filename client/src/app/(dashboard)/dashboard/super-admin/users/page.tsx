"use client";

import {
  User,
  Users as UsersIcon,
  Search,
  Filter,
  UserCog,
} from "lucide-react";
import { useState } from "react";
import { DataTable, Column } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSuperAdminUsers } from "@/features/super-admin/hooks/useSuperAdmin";
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
      render: () => (
        <Badge
          variant="outline"
          className="bg-emerald-50 text-emerald-600 border-emerald-100 font-medium space-x-1"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Active</span>
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
      render: () => (
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-primary/10 hover:text-primary transition-colors"
        >
          <UserCog className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
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
