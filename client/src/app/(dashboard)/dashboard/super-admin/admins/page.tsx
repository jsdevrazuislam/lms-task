"use client";

import {
  Shield,
  MoreVertical,
  Ban,
  Users as UsersIcon,
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
import { CreateAdminModal } from "@/features/super-admin/components/CreateAdminModal";
import {
  useSuperAdminAdmins,
  useToggleUserStatus,
  useDeleteUser,
} from "@/features/super-admin/hooks/useSuperAdmin";
import { ISuperAdminUser } from "@/features/super-admin/types";

export default function AdminManagementPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { data: response, isLoading } = useSuperAdminAdmins(
    currentPage,
    pageSize,
  );

  const { mutate: toggleStatus } = useToggleUserStatus();
  const { mutate: deleteUser } = useDeleteUser();

  const columns: Column<ISuperAdminUser>[] = [
    {
      header: "Admin User",
      render: (admin: ISuperAdminUser) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-sm-theme">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <span className="font-bold text-foreground block">
              {admin.firstName} {admin.lastName}
            </span>
            <span className="text-[10px] text-primary uppercase font-bold tracking-widest">
              Platform Admin
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Email Address",
      accessor: "email",
      className: "text-muted-foreground font-medium",
    },
    {
      header: "Joined Date",
      render: (admin: ISuperAdminUser) => (
        <span className="font-medium">
          {new Date(admin.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: "Status",
      render: (admin: ISuperAdminUser) => (
        <Badge
          variant="outline"
          className={`${
            admin.isActive
              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
              : "bg-red-50 text-red-600 border-red-100"
          } font-bold`}
        >
          {admin.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      header: "Actions",
      thClassName: "text-right",
      className: "text-right",
      render: (admin: ISuperAdminUser) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-xl hover:bg-muted transition-all"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 rounded-2xl shadow-xl animate-in fade-in slide-in-from-top-2"
          >
            <DropdownMenuItem
              className="gap-3 py-3 rounded-xl cursor-pointer"
              onClick={() =>
                toggleStatus({ id: admin.id, isActive: !admin.isActive })
              }
            >
              {admin.isActive ? (
                <>
                  <Ban className="w-4 h-4" /> Deactivate Account
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 text-emerald-500" /> Activate
                  Account
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-3 py-3 rounded-xl cursor-pointer"
              onClick={() => {
                if (
                  confirm("Are you sure you want to delete this admin forever?")
                ) {
                  deleteUser(admin.id);
                }
              }}
            >
              <Trash2 className="w-4 h-4" /> Delete Permanently
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
          <h1 className="text-4xl font-extrabold tracking-tight bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Admin Management
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Control center for platform administrators.
          </p>
        </div>
        <CreateAdminModal />
      </div>

      <Card className="border-none shadow-xl-theme bg-card/50 backdrop-blur-sm overflow-hidden rounded-3xl">
        <div className="p-6">
          <DataTable
            columns={columns}
            data={response?.data || []}
            isLoading={isLoading}
            emptyState={{
              icon: UsersIcon,
              title: "No admins found",
              description:
                "You haven't added any secondary administrators yet.",
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
