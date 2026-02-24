"use client";
import { useRouter } from "@bprogress/next";
import {
  Search,
  Plus,
  MoreHorizontal,
  BookOpen,
  Users,
  DollarSign,
  TrendingUp,
  Edit3,
  Eye,
  Filter,
  Star,
  ArrowUpDown,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { DataTable } from "@/components/shared/DataTable";
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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  useInstructorCourses,
  useInstructorStats,
} from "@/features/instructor/hooks/useInstructor";
import { IInstructorCourseStats as Course } from "@/features/instructor/services/instructor.service";

type CourseStatus = "published" | "draft" | "archived";

const PAGE_SIZE = 6;

type SortKey = "newest" | "revenue" | "students";

const statusConfig: Record<
  CourseStatus,
  { label: string; className: string; dot: string }
> = {
  published: {
    label: "Published",
    className: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    dot: "bg-emerald-500",
  },
  draft: {
    label: "Draft",
    className: "bg-amber-50 text-amber-700 border border-amber-200",
    dot: "bg-amber-400",
  },
  archived: {
    label: "Archived",
    className: "bg-muted text-muted-foreground border border-border",
    dot: "bg-muted-foreground",
  },
};

const sortOptions: { key: SortKey; label: string }[] = [
  { key: "newest", label: "Newest First" },
  { key: "revenue", label: "Highest Revenue" },
  { key: "students", label: "Most Students" },
];

const statusFilters: { key: CourseStatus | "all"; label: string }[] = [
  { key: "all", label: "All Courses" },
  { key: "published", label: "Published" },
  { key: "draft", label: "Draft" },
  { key: "archived", label: "Archived" },
];

function formatRevenue(value: number) {
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`;
  return `$${value.toLocaleString()}`;
}

const CoursesClient = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<CourseStatus | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const {
    data: coursesData,
    isLoading: isCoursesLoading,
    handleDelete,
  } = useInstructorCourses();
  const { data: statsData, isLoading: isStatsLoading } = useInstructorStats();

  const courses = useMemo(() => coursesData || [], [coursesData]);

  const onDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await handleDelete(deleteTarget);
      setDeleteTarget(null);
    } catch (err) {
      console.error("Delete course failed", err);
    }
  };

  const filtered = useMemo(() => {
    let result = courses.filter((c) => {
      const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
      const matchStatus =
        statusFilter === "all" || c.status.toLowerCase() === statusFilter;
      return matchSearch && matchStatus;
    });

    if (sortKey === "revenue") {
      result = [...result].sort((a, b) => b.revenue - a.revenue);
    } else if (sortKey === "students") {
      result = [...result].sort(
        (a, b) => b.enrolledStudents - a.enrolledStudents,
      );
    }
    return result;
  }, [courses, search, statusFilter, sortKey]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  const currentSortLabel =
    sortOptions.find((s) => s.key === sortKey)?.label ?? "Sort";

  const columns = [
    {
      header: "Course",
      render: (course: Course) => (
        <div className="flex items-center gap-4 py-1">
          <div className="relative shrink-0 w-20 h-12 rounded-xl overflow-hidden shadow-sm ring-1 ring-border bg-muted">
            {course.thumbnail ? (
              <Image
                src={course.thumbnail}
                alt={course.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-xs">
                📚
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-foreground text-sm line-clamp-1 group-hover:text-primary transition-colors">
              {course.title}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Star className="w-3 h-3 fill-primary text-primary" />
              <span className="text-[10px] font-bold text-foreground">
                {course.rating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      render: (course: Course) => {
        const status =
          statusConfig[course.status.toLowerCase() as CourseStatus] ||
          statusConfig.draft;
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${status.className}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
            {status.label}
          </span>
        );
      },
    },
    {
      header: "Students",
      render: (course: Course) => (
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-bold">
            {course.enrolledStudents.toLocaleString()}
          </span>
        </div>
      ),
    },
    {
      header: "Revenue",
      render: (course: Course) => (
        <span className="text-sm font-extrabold text-foreground">
          {formatRevenue(course.revenue)}
        </span>
      ),
    },
    {
      header: "",
      thClassName: "w-16",
      render: (course: Course) => (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl hover:bg-muted/50"
              >
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-52 bg-popover border border-border shadow-elevated rounded-2xl p-2 z-50"
            >
              <DropdownMenuItem
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer font-semibold text-sm"
                onClick={() =>
                  router.push(`/dashboard/instructor/courses/${course.id}/edit`)
                }
              >
                <Edit3 className="w-4 h-4 text-muted-foreground" /> Edit Course
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer font-semibold text-sm"
                onClick={() => window.open(`/courses/${course.id}`, "_blank")}
              >
                <Eye className="w-4 h-4 text-muted-foreground" /> View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer font-semibold text-sm text-destructive"
                onClick={() => setDeleteTarget(course.id)}
              >
                <Trash2 className="w-4 h-4" /> Delete Course
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Courses</h1>
          <p className="text-muted-foreground mt-1.5">
            Manage and track your educational content.
          </p>
        </div>
        <Link href="/dashboard/instructor/courses/new">
          <Button className="h-12 px-6 rounded-xl font-bold gap-2 shadow-elevated">
            <Plus className="w-5 h-5" /> Create New Course
          </Button>
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<BookOpen className="w-5 h-5" />}
          title="Total Courses"
          value={`${statsData?.totalCourses || 0}`}
          sub={`${courses.filter((c) => c.status.toLowerCase() === "published").length} Live`}
          color="bg-primary/10 text-primary"
          loading={isStatsLoading}
        />
        <StatCard
          icon={<Users className="w-5 h-5" />}
          title="Total Students"
          value={statsData?.totalStudents?.toLocaleString() || "0"}
          description="Lifetime enrollments"
          color="bg-emerald-50 text-emerald-600"
          loading={isStatsLoading}
        />
        <StatCard
          icon={<DollarSign className="w-5 h-5" />}
          title="Total Revenue"
          value={formatRevenue(statsData?.totalRevenue || 0)}
          description="Overall earnings"
          color="bg-amber-50 text-amber-600"
          loading={isStatsLoading}
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5" />}
          title="Avg. Rating"
          value={statsData?.avgRating?.toFixed(1) || "0.0"}
          description="From all student reviews"
          color="bg-blue-50 text-blue-600"
          loading={isStatsLoading}
        />
      </div>

      {/* Table Area */}
      <div className="space-y-4">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search courses by title..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-11 h-12 rounded-2xl bg-card border-border focus:ring-2 focus:ring-primary/10 transition-all font-medium"
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-1.5 bg-muted/40 p-1.5 rounded-2xl border border-border/50">
              {statusFilters.map((sf) => (
                <button
                  key={sf.key}
                  onClick={() => {
                    setStatusFilter(sf.key as CourseStatus | "all");
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                    statusFilter === sf.key
                      ? "bg-primary text-white shadow-md"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {sf.label}
                </button>
              ))}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-12 px-5 gap-3 rounded-2xl border-border font-bold text-xs"
                >
                  <ArrowUpDown className="w-4 h-4 opacity-70" />{" "}
                  {currentSortLabel}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 bg-popover border border-border shadow-elevated rounded-2xl p-2 z-50"
              >
                {sortOptions.map((opt) => (
                  <DropdownMenuItem
                    key={opt.key}
                    onClick={() => {
                      setSortKey(opt.key);
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-2.5 rounded-xl cursor-pointer text-sm font-semibold ${sortKey === opt.key ? "text-primary bg-primary-muted" : ""}`}
                  >
                    {opt.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={paginated}
          isLoading={isCoursesLoading}
          emptyState={{
            icon: Filter,
            title: "No courses found",
            description:
              "No courses match your current search or filters. Try a different query.",
            actionLabel: "Clear filters",
            onAction: () => {
              setSearch("");
              setStatusFilter("all");
            },
          }}
          pagination={{
            totalItems: filtered.length,
            pageSize: PAGE_SIZE,
            currentPage: currentPage,
            onPageChange: setCurrentPage,
          }}
        />
      </div>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">
              Are you sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This action cannot be undone. This will permanently delete your
              course and all its content.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onDeleteConfirm}
              className="bg-destructive hover:bg-destructive/90 text-white rounded-xl"
            >
              Delete Course
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CoursesClient;
