"use client";
import {
  Search,
  Users,
  CheckCircle,
  Clock,
  Mail,
  Calendar,
  Activity,
  GraduationCap,
} from "lucide-react";
import Image from "next/image";
import React, { useState, useMemo } from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { DataTable } from "@/components/shared/DataTable";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useInstructorStats,
  useInstructorCourses,
  useInstructorStudents,
} from "@/features/instructor/hooks/useInstructor";
import { IInstructorStudent as Student } from "@/features/instructor/services/instructor.service";

type EnrollmentStatus = "active" | "completed" | "dropped";

const PAGE_SIZE = 8;

const statusFilters: { key: EnrollmentStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "completed", label: "Completed" },
  { key: "dropped", label: "Dropped" },
];

const statusConfig: Record<
  string,
  { label: string; className: string; dot: string }
> = {
  active: {
    label: "Active",
    className: "bg-primary/10 text-primary border border-primary/20",
    dot: "bg-primary",
  },
  completed: {
    label: "Completed",
    className: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    dot: "bg-emerald-500",
  },
  dropped: {
    label: "Dropped",
    className:
      "bg-destructive/10 text-destructive border border-destructive/20",
    dot: "bg-destructive",
  },
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function timeAgo(d: string) {
  const days = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

const ProgressBar = ({ value }: { value: number }) => (
  <div className="flex items-center gap-2.5 min-w-0">
    <div className="flex-1 bg-muted rounded-full h-1.5 overflow-hidden min-w-[60px]">
      <div
        className={`h-full rounded-full transition-all duration-500 ${
          value === 100
            ? "bg-primary"
            : value > 60
              ? "bg-primary/70"
              : "bg-primary/40"
        }`}
        style={{
          width: `${value}%`,
        }}
      />
    </div>
    <span className="text-xs font-semibold text-foreground w-8 shrink-0 text-right">
      {value}%
    </span>
  </div>
);

const StudentsClient = () => {
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<EnrollmentStatus | "all">(
    "all",
  );
  const [currentPage, setCurrentPage] = useState(1);

  const { data: statsData, isLoading: isStatsLoading } = useInstructorStats();
  const { data: coursesData } = useInstructorCourses();
  const { data: studentsData, isLoading: isStudentsLoading } =
    useInstructorStudents();

  const publishedCourses = useMemo(
    () =>
      (coursesData || []).filter((c) => c.status.toLowerCase() === "published"),
    [coursesData],
  );

  const filtered = useMemo(() => {
    return (studentsData || []).filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase());
      const matchCourse =
        courseFilter === "all" ||
        s.courseTitle ===
          coursesData?.find((c) => c.id === courseFilter)?.title;
      const matchStatus =
        statusFilter === "all" || s.status.toLowerCase() === statusFilter;
      return matchSearch && matchCourse && matchStatus;
    });
  }, [studentsData, search, courseFilter, statusFilter, coursesData]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  const stats = useMemo(
    () => ({
      total: statsData?.totalStudents || 0,
      active: (studentsData || []).filter(
        (s) => s.status.toLowerCase() === "active",
      ).length,
      completed: (studentsData || []).filter(
        (s) => s.status.toLowerCase() === "completed",
      ).length,
      avgProgress: studentsData?.length
        ? Math.round(
            studentsData.reduce((a, s) => a + s.progress, 0) /
              studentsData.length,
          )
        : 0,
    }),
    [statsData, studentsData],
  );

  const columns = [
    {
      header: "Student",
      render: (student: Student) => (
        <div className="flex items-center gap-3 py-1">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0 overflow-hidden ring-2 ring-border shadow-sm relative">
            {student.avatar ? (
              <Image
                src={student.avatar}
                alt={student.name}
                fill
                className="object-cover"
              />
            ) : (
              <span className="text-xs font-bold text-muted-foreground">
                {student.name.charAt(0)}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">
              {student.name}
            </p>
            <p className="text-[11px] text-muted-foreground truncate flex items-center gap-1">
              <Mail className="w-2.5 h-2.5" /> {student.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Course",
      render: (student: Student) => (
        <div className="max-w-[200px]">
          <p className="text-sm font-medium text-foreground line-clamp-1">
            {student.courseTitle}
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
            <GraduationCap className="w-2.5 h-2.5" /> Enrolled
          </p>
        </div>
      ),
    },
    {
      header: "Progress",
      thClassName: "min-w-[150px]",
      render: (student: Student) => (
        <ProgressBar value={student.progress || 0} />
      ),
    },
    {
      header: "Status",
      render: (student: Student) => {
        const cfg =
          statusConfig[student.status.toLowerCase()] || statusConfig.active;
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${cfg.className}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
          </span>
        );
      },
    },
    {
      header: "Joined",
      render: (student: Student) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-foreground">
            {formatDate(student.enrolledAt)}
          </span>
          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
            <Calendar className="w-2.5 h-2.5" /> Date
          </span>
        </div>
      ),
    },
    {
      header: "Last Activity",
      render: (student: Student) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-foreground">
            {timeAgo(student.lastActive)}
          </span>
          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
            <Activity className="w-2.5 h-2.5" /> Latest
          </span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Student Management
        </h1>
        <p className="text-muted-foreground mt-1.5">
          Track enrollment progress and student engagement.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Users className="w-5 h-5" />}
          title="Total Students"
          value={`${stats.total}`}
          description="Across all courses"
          color="bg-primary/10 text-primary"
          loading={isStatsLoading}
        />
        <StatCard
          icon={<Clock className="w-5 h-5" />}
          title="Active Now"
          value={`${stats.active}`}
          description="Currently learning"
          color="bg-amber-50 text-amber-600"
          loading={isStudentsLoading}
        />
        <StatCard
          icon={<CheckCircle className="w-5 h-5" />}
          title="Completed"
          value={`${stats.completed}`}
          description="Finished courses"
          color="bg-emerald-50 text-emerald-600"
          loading={isStudentsLoading}
        />
        <StatCard
          icon={<Activity className="w-5 h-5" />}
          title="Avg. Progress"
          value={`${stats.avgProgress}%`}
          description="Engagement rate"
          color="bg-blue-50 text-blue-600"
          loading={isStudentsLoading}
        />
      </div>

      {/* Content Area */}
      <div className="space-y-4">
        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between bg-card p-4 rounded-2xl border border-border">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-11 h-12 rounded-xl bg-muted/30 border-transparent focus:bg-background focus:ring-2 focus:ring-primary/10 transition-all font-medium"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <Select
              value={courseFilter}
              onValueChange={(val) => {
                setCourseFilter(val);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-12 px-4 rounded-xl bg-muted/30 border-transparent text-sm font-bold text-foreground focus:ring-0 focus:ring-offset-0 transition-all min-w-[180px]">
                <SelectValue placeholder="All Courses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {publishedCourses.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-xl border border-transparent">
              {statusFilters.map((sf) => (
                <button
                  key={sf.key}
                  onClick={() => {
                    setStatusFilter(sf.key);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 whitespace-nowrap ${
                    statusFilter === sf.key
                      ? "bg-primary text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {sf.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={paginated}
          isLoading={isStudentsLoading}
          emptyState={{
            icon: Users,
            title: "No students found",
            description:
              "Try adjusting your filters or search query to find students.",
            actionLabel: "Clear all filters",
            onAction: () => {
              setSearch("");
              setCourseFilter("all");
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
    </div>
  );
};

export default StudentsClient;
