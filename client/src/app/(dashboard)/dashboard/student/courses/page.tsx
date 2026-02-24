"use client";

import {
  Search,
  BookOpen,
  Play,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { IEnrollment } from "@/features/enrollment/enrollment.api";
import { useStudentEnrollments } from "@/features/enrollment/hooks/useStudentEnrollments";

type StatusFilter = "all" | "active" | "completed" | "dropped";
type SortOption = "recent" | "progress" | "az";

const PAGE_SIZE = 6;

const ProgressBar = ({ value }: { value: number }) => (
  <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
    <div
      className="h-full rounded-full transition-all duration-700"
      style={{
        width: `${value}%`,
        background:
          value === 100
            ? "hsl(var(--primary))"
            : value > 50
              ? "hsl(var(--primary))"
              : "hsl(var(--primary))",
      }}
    />
  </div>
);

interface StatusConfig {
  label: string;
  color: string;
  icon: React.ElementType;
}

const statusConfig: Record<string, StatusConfig> = {
  ACTIVE: { label: "Active", color: "bg-primary/10 text-primary", icon: Clock },
  COMPLETED: {
    label: "Completed",
    color: "bg-emerald-100 text-emerald-700",
    icon: CheckCircle2,
  },
  DROPPED: {
    label: "Dropped",
    color: "bg-destructive/10 text-destructive",
    icon: XCircle,
  },
};

const CourseCard = ({ enrollment }: { enrollment: IEnrollment }) => {
  const status = enrollment.status || "ACTIVE";
  const cfg = statusConfig[status] || statusConfig.ACTIVE;
  const StatusIcon = cfg.icon;

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 group flex flex-col">
      <div className="relative h-44 overflow-hidden shrink-0">
        <Image
          src={enrollment.course.thumbnail || "/placeholder-course.png"}
          alt={enrollment.course.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
        <span
          className={`absolute top-3 left-3 inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${cfg.color} bg-white/90 backdrop-blur`}
        >
          <StatusIcon className="w-3 h-3" />
          {cfg.label}
        </span>
        {status === "COMPLETED" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 backdrop-blur flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <p className="text-xs text-muted-foreground font-medium mb-1">
          {enrollment.course.instructor?.firstName}{" "}
          {enrollment.course.instructor?.lastName}
        </p>
        <h3 className="font-bold text-foreground leading-snug mb-3 flex-1 line-clamp-2">
          {enrollment.course.title}
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {enrollment.completedLessons || 0}/{enrollment.totalLessons || 0}{" "}
              lessons
            </span>
            <span className="font-bold text-primary">
              {enrollment.progress || 0}%
            </span>
          </div>
          <ProgressBar value={enrollment.progress || 0} />
        </div>

        <div className="flex items-center gap-2">
          {status !== "DROPPED" ? (
            <Link
              href={`/dashboard/student/courses/${enrollment.courseId}`}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-4 py-2.5 rounded-xl text-sm hover:bg-primary/90 transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              {status === "COMPLETED" ? "Review" : "Continue"}
            </Link>
          ) : (
            <button className="flex-1 inline-flex items-center justify-center gap-2 border border-border text-muted-foreground font-semibold px-4 py-2.5 rounded-xl text-sm hover:bg-muted/50 transition-colors">
              Re-enroll
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default function StudentCourses() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sort, setSort] = useState<SortOption>("recent");
  const [page, setPage] = useState(0);

  const { data: enrollmentsData, isLoading } = useStudentEnrollments();
  const enrollments = useMemo(
    () => enrollmentsData?.data || [],
    [enrollmentsData],
  );

  const filtered = useMemo(() => {
    let data = [...enrollments];
    if (statusFilter !== "all")
      data = data.filter((e) => e.status === statusFilter.toUpperCase());
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter((e) => e.course.title.toLowerCase().includes(q));
    }
    if (sort === "recent")
      data.sort(
        (a, b) =>
          new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime(),
      );
    else if (sort === "progress")
      data.sort((a, b) => (b.progress || 0) - (a.progress || 0));
    else data.sort((a, b) => a.course.title.localeCompare(b.course.title));
    return data;
  }, [enrollments, search, statusFilter, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const paginated = filtered.slice(
    safePage * PAGE_SIZE,
    (safePage + 1) * PAGE_SIZE,
  );

  const statusTabs: { value: StatusFilter; label: string; count: number }[] = [
    { value: "all", label: "All", count: enrollments.length },
    {
      value: "active",
      label: "Active",
      count: enrollments.filter((e) => e.status === "ACTIVE").length,
    },
    {
      value: "completed",
      label: "Completed",
      count: enrollments.filter((e) => e.status === "COMPLETED").length,
    },
    {
      value: "dropped",
      label: "Dropped",
      count: enrollments.filter((e) => e.status === "DROPPED").length,
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-card border border-border rounded-2xl overflow-hidden p-0 h-[380px]"
          >
            <Skeleton className="h-44 w-full rounded-none" />
            <div className="p-5 space-y-3">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-4/5" />
              <div className="pt-4 space-y-2">
                <Skeleton className="h-2 w-full" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            className="pl-9 rounded-xl"
          />
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={sort}
            onValueChange={(val) => {
              setSort(val as SortOption);
              setPage(0);
            }}
          >
            <SelectTrigger className="w-[180px] h-10 rounded-xl bg-card border-border">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recently Enrolled</SelectItem>
              <SelectItem value="progress">Progress %</SelectItem>
              <SelectItem value="az">A–Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-6">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => {
              setStatusFilter(tab.value);
              setPage(0);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
              statusFilter === tab.value
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                statusFilter === tab.value
                  ? "bg-white/20 text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Grid */}
      {paginated.length === 0 ? (
        <div className="bg-card border border-border rounded-3xl p-16 text-center shadow-card">
          <BookOpen className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-foreground mb-2">
            No courses found
          </h3>
          <p className="text-muted-foreground mb-6">
            Try adjusting your filters or explore new courses.
          </p>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-xl text-sm hover:bg-primary/90 transition-colors"
          >
            Explore Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {paginated.map((e) => (
            <CourseCard key={e.id} enrollment={e} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {safePage * PAGE_SIZE + 1}–
            {Math.min((safePage + 1) * PAGE_SIZE, filtered.length)} of{" "}
            {filtered.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={safePage === 0}
              className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-foreground hover:bg-muted/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-9 h-9 rounded-xl text-sm font-bold transition-all duration-200 ${
                  i === safePage
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "border border-border text-foreground hover:bg-muted/50"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={safePage === totalPages - 1}
              className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-foreground hover:bg-muted/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
