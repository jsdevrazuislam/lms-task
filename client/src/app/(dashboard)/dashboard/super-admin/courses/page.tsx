"use client";

import {
  BookOpen,
  MoreVertical,
  Eye,
  Globe,
  Archive,
  AlertCircle,
  BookMarked,
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
import {
  useSuperAdminCourses,
  useOverrideCourseStatus,
} from "@/features/super-admin/hooks/useSuperAdmin";
import { ISuperAdminCourse } from "@/features/super-admin/types";

export default function CourseGovernancePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { data: response, isLoading } = useSuperAdminCourses(
    currentPage,
    pageSize,
  );
  const { mutate: overrideStatus } = useOverrideCourseStatus();

  const handleOverrideStatus = (id: string, status: string) => {
    overrideStatus({ id, status });
  };

  const columns: Column<ISuperAdminCourse>[] = [
    {
      header: "Course Details",
      render: (course: ISuperAdminCourse) => (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10 shadow-inner">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
          <div>
            <span className="font-bold text-foreground block text-base truncate max-w-[300px]">
              {course.title}
            </span>
            <span className="text-xs text-muted-foreground font-medium">
              ID: {course.id.slice(0, 8)}...
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Instructor",
      render: (course: ISuperAdminCourse) => (
        <div className="flex flex-col">
          <span className="font-semibold text-foreground">
            {course.instructor.firstName} {course.instructor.lastName}
          </span>
          <span className="text-[10px] uppercase tracking-tighter text-muted-foreground font-bold">
            Author
          </span>
        </div>
      ),
    },
    {
      header: "Enrollments",
      render: (course: ISuperAdminCourse) => (
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-muted rounded-lg font-bold text-sm">
            {course._count.enrollments}
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      render: (course: ISuperAdminCourse) => (
        <Badge
          variant={course.status === "PUBLISHED" ? "default" : "secondary"}
          className={`font-bold uppercase tracking-wider text-[10px] py-1 px-2.5 ${
            course.status === "PUBLISHED"
              ? "bg-emerald-500 hover:bg-emerald-600"
              : ""
          }`}
        >
          {course.status}
        </Badge>
      ),
    },
    {
      header: "Governance Actions",
      thClassName: "text-right",
      className: "text-right",
      render: (course: ISuperAdminCourse) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 h-9 rounded-xl border-border hover:bg-muted font-bold transition-all"
            >
              Override Status <MoreVertical className="w-3.5 h-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-64 rounded-2xl shadow-2xl p-2 animate-in fade-in zoom-in-95 duration-200"
          >
            <DropdownMenuItem
              className="gap-3 py-3 rounded-xl transition-colors"
              onClick={() => handleOverrideStatus(course.id, "PUBLISHED")}
            >
              <Globe className="w-4 h-4 text-emerald-500" />
              <div className="flex flex-col">
                <span className="font-bold">Force Publish</span>
                <span className="text-[10px] opacity-70 font-medium">
                  Make course visible to all students
                </span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-3 py-3 rounded-xl transition-colors"
              onClick={() => handleOverrideStatus(course.id, "DRAFT")}
            >
              <Eye className="w-4 h-4 text-orange-500" />
              <div className="flex flex-col">
                <span className="font-bold">Move to Draft</span>
                <span className="text-[10px] opacity-70 font-medium">
                  Hide from public marketplace
                </span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-3 py-3 rounded-xl transition-colors"
              onClick={() => handleOverrideStatus(course.id, "ARCHIVED")}
            >
              <Archive className="w-4 h-4 text-destructive" />
              <div className="flex flex-col">
                <span className="font-bold text-destructive">
                  Force Archive
                </span>
                <span className="text-[10px] opacity-70 font-medium">
                  Soft delete from the platform
                </span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Course Governance
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Ultimate authority over platform content.
        </p>
      </div>

      <Card className="border-none shadow-xl-theme bg-card/50 backdrop-blur-sm overflow-hidden rounded-3xl">
        <div className="p-6">
          <DataTable
            columns={columns}
            data={response?.data || []}
            isLoading={isLoading}
            emptyState={{
              icon: BookMarked,
              title: "No courses found",
              description: "The platform content library is currently empty.",
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

      <div className="p-5 bg-primary/5 rounded-3xl flex items-start gap-4 border border-primary/10 shadow-sm-theme transition-all hover:bg-primary/10">
        <div className="p-2 bg-primary/10 rounded-xl">
          <AlertCircle className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-sm font-bold text-primary uppercase tracking-widest mb-1">
            Security Audit Note
          </p>
          <p className="text-sm text-muted-foreground font-medium leading-relaxed">
            These actions bypass instructor restrictions. Every status override
            is logged and tied to your administrative session for security
            compliance.
          </p>
        </div>
      </div>
    </div>
  );
}
