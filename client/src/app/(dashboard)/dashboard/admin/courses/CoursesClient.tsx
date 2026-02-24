"use client";

import {
  Search,
  MoreHorizontal,
  Eye,
  Archive,
  Filter,
  RefreshCcw,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useAdminCourses } from "@/features/admin/hooks/useAdminCourses";
import {
  categoryService,
  Category,
} from "@/features/admin/services/category.service";
import { CourseStatus } from "@/features/course/services/course.service";
import { ICourse } from "@/features/course/types";

const statusColor: Record<string, string> = {
  PUBLISHED: "bg-success-muted text-success border-success/20",
  DRAFT: "bg-warning-muted text-warning border-warning/20",
  ARCHIVED: "bg-muted text-muted-foreground border-border",
};

const AdminCourses = () => {
  const {
    courses,
    meta,
    isLoading,
    error,
    filters,
    setFilters,
    handleUpdateStatus,
    refetch,
  } = useAdminCourses();

  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [archiveTarget, setArchiveTarget] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await categoryService.getAllCategories();
        setCategories(result.data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, searchTerm: search, page: 1 }));
  };

  const columns = [
    {
      header: "Course",
      render: (c: ICourse) => (
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-muted border border-border shrink-0">
            <Image
              src={c.thumbnail || "/placeholder-course.png"}
              alt={c.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-sm text-foreground line-clamp-1">
              {c.title}
            </span>
            <span className="text-xs text-muted-foreground line-clamp-1">
              ID: {c.id}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Instructor",
      render: (c: ICourse) => (
        <span className="text-sm font-medium text-muted-foreground">
          {c.instructor
            ? `${c.instructor.firstName} ${c.instructor.lastName}`
            : "Unknown"}
        </span>
      ),
    },
    {
      header: "Category",
      render: (c: ICourse) => (
        <Badge
          variant="secondary"
          className="bg-muted text-muted-foreground font-medium border-none px-2 py-0.5"
        >
          {c.category?.name || "Uncategorized"}
        </Badge>
      ),
    },
    {
      header: "Status",
      render: (c: ICourse) => (
        <Badge
          variant="outline"
          className={`capitalize text-[10px] font-bold tracking-wider px-2 py-0.5 ${statusColor[c.status]}`}
        >
          {c.status.toLowerCase()}
        </Badge>
      ),
    },
    {
      header: "Students",
      thClassName: "text-right",
      className: "text-right",
      render: (c: ICourse) => (
        <span className="font-bold text-sm tabular-nums text-foreground">
          {c.students?.toLocaleString() || 0}
        </span>
      ),
    },
    {
      header: "",
      className: "w-12",
      render: (c: ICourse) => (
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
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              className="gap-2 cursor-pointer"
              onClick={() => window.open(`/courses/${c.id}`, "_blank")}
            >
              <Eye className="w-4 h-4 text-info" /> View Page
            </DropdownMenuItem>
            {c.status !== CourseStatus.ARCHIVED && (
              <DropdownMenuItem
                onClick={() => setArchiveTarget(c.id)}
                className="gap-2 cursor-pointer"
              >
                <Archive className="w-4 h-4" /> Archive Course
              </DropdownMenuItem>
            )}
            {c.status === CourseStatus.DRAFT && (
              <DropdownMenuItem
                onClick={() => handleUpdateStatus(c.id, CourseStatus.PUBLISHED)}
                className="gap-2 cursor-pointer"
              >
                <RefreshCcw className="w-4 h-4" /> Publish Course
              </DropdownMenuItem>
            )}
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
          <h2 className="text-xl font-bold">Error Loading Courses</h2>
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">
                Course Management
              </h1>
              <Button
                onClick={() => refetch()}
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                disabled={isLoading}
              >
                <RefreshCcw
                  className={isLoading ? "animate-spin w-4 h-4" : "w-4 h-4"}
                />
              </Button>
            </div>
            <p className="text-muted-foreground">
              Manage platform courses, check status, and student enrollments.
            </p>
          </div>
        </div>

        <Card className="border-border overflow-hidden">
          <CardContent className="p-4 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <form onSubmit={handleSearch} className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by course title…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 h-10 rounded-xl"
                />
              </form>
              <div className="flex flex-wrap gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="gap-2 h-10 rounded-xl border-border"
                    >
                      <Filter className="w-4 h-4" />
                      {filters.status
                        ? filters.status.charAt(0) +
                          filters.status.slice(1).toLowerCase()
                        : "All Status"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          status: undefined,
                          page: 1,
                        }))
                      }
                    >
                      All Status
                    </DropdownMenuItem>
                    {Object.values(CourseStatus).map((s) => (
                      <DropdownMenuItem
                        key={s}
                        onClick={() =>
                          setFilters((prev) => ({
                            ...prev,
                            status: s,
                            page: 1,
                          }))
                        }
                      >
                        {s.charAt(0) + s.slice(1).toLowerCase()}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="gap-2 h-10 rounded-xl border-border"
                    >
                      <Filter className="w-4 h-4" />
                      {filters.categoryId
                        ? categories.find((c) => c.id === filters.categoryId)
                            ?.name || "Category"
                        : "All Categories"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 max-h-64 overflow-y-auto"
                  >
                    <DropdownMenuItem
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          categoryId: undefined,
                          page: 1,
                        }))
                      }
                    >
                      All Categories
                    </DropdownMenuItem>
                    {categories.map((cat) => (
                      <DropdownMenuItem
                        key={cat.id}
                        onClick={() =>
                          setFilters((prev) => ({
                            ...prev,
                            categoryId: cat.id,
                            page: 1,
                          }))
                        }
                      >
                        {cat.name}
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
          data={courses}
          isLoading={isLoading}
          pagination={{
            totalItems: meta.total,
            pageSize: meta.limit,
            currentPage: meta.page,
            onPageChange: (page) => setFilters((prev) => ({ ...prev, page })),
          }}
          emptyState={{
            icon: Search,
            title: "No courses found",
            description:
              "Try adjusting your search or filters to find what you are looking for.",
          }}
        />

        <AlertDialog
          open={!!archiveTarget}
          onOpenChange={(open) => !open && setArchiveTarget(null)}
        >
          <AlertDialogContent className="rounded-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-bold">
                Archive this course?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground">
                This course will be marked as archived and hidden from students.
                The instructor can request to restore it later.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-xl">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  archiveTarget &&
                  handleUpdateStatus(archiveTarget, CourseStatus.ARCHIVED)
                }
                className="bg-destructive hover:bg-destructive/90 text-white rounded-xl"
              >
                Archive
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </ErrorBoundary>
  );
};

export default AdminCourses;
