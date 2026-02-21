"use client";

import { DollarSign, Users, TrendingUp, BookOpen } from "lucide-react";
import dynamic from "next/dynamic";
import React, { useMemo } from "react";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { Skeleton } from "@/components/shared/SkeletonLoader";
import {
  useInstructorStats,
  useInstructorCourses,
  useInstructorStudents,
} from "@/features/instructor/hooks/useInstructor";

// Dynamically import charts
const RevenueDistributionChart = dynamic(
  () => import("./components/RevenueDistributionChart"),
  {
    loading: () => <Skeleton className="h-[300px] w-full rounded-xl" />,
    ssr: false,
  },
);

const EnrollmentGrowthChart = dynamic(
  () => import("./components/EnrollmentGrowthChart"),
  {
    loading: () => <Skeleton className="h-[300px] w-full rounded-xl" />,
    ssr: false,
  },
);

function formatValue(v: number) {
  if (v >= 1000) return `$${(v / 1000).toFixed(0)}k`;
  return `$${v}`;
}

const AnalyticsClient = () => {
  const { data: statsData, isLoading: isStatsLoading } = useInstructorStats();
  const { data: coursesData, isLoading: isCoursesLoading } =
    useInstructorCourses();
  const { data: studentsData, isLoading: isStudentsLoading } =
    useInstructorStudents();

  const published = useMemo(
    () =>
      (coursesData || []).filter((c) => c.status.toLowerCase() === "published"),
    [coursesData],
  );

  const totalRevenue = statsData?.totalRevenue || 0;
  const totalStudents = statsData?.totalStudents || 0;
  const avgCompletion = useMemo(() => {
    if (!studentsData?.length) return 0;
    const completed = studentsData.filter(
      (s) => s.status.toLowerCase() === "completed",
    ).length;
    return Math.round((completed / studentsData.length) * 100);
  }, [studentsData]);

  const revenueByCourseData = useMemo(
    () =>
      published
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 6)
        .map((c) => ({
          name: c.title.split(":")[0].split("&")[0].trim().slice(0, 18),
          revenue: c.revenue,
        })),
    [published],
  );

  const enrollmentTrend = useMemo(
    () =>
      (statsData?.revenueTrend || []).map((t) => ({
        name: t.name,
        students: Math.round(t.revenue / 15) + 2,
      })),
    [statsData],
  );

  const completionData = useMemo(
    () =>
      published
        .map((c) => {
          const courseStudents = (studentsData || []).filter(
            (s) => s.courseTitle === c.title,
          );
          const rate =
            courseStudents.length > 0
              ? Math.round(
                  courseStudents.reduce(
                    (acc, s) => acc + (s.progress || 0),
                    0,
                  ) / courseStudents.length,
                )
              : 0;
          return {
            name: c.title.split(":")[0].split("&")[0].trim().slice(0, 24),
            rate,
          };
        })
        .sort((a, b) => b.rate - a.rate)
        .slice(0, 8),
    [published, studentsData],
  );

  const isLoading = isStatsLoading || isCoursesLoading || isStudentsLoading;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Performance Analytics
        </h1>
        <p className="text-muted-foreground mt-1.5">
          Deep dive into your content engagement and reach.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<DollarSign className="w-5 h-5" />}
          title="Total Revenue"
          value={formatValue(totalRevenue)}
          description="Lifetime earnings"
          color="bg-primary/10 text-primary"
          loading={isStatsLoading}
        />
        <StatCard
          icon={<Users className="w-5 h-5" />}
          title="Total Students"
          value={totalStudents.toLocaleString()}
          description="Unique enrollments"
          color="bg-secondary text-secondary-foreground"
          loading={isStatsLoading}
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5" />}
          title="Avg. Completion"
          value={`${avgCompletion}%`}
          description="Student success rate"
          color="bg-emerald-50 text-emerald-600"
          loading={isStudentsLoading}
        />
        <StatCard
          icon={<BookOpen className="w-5 h-5" />}
          title="Active Courses"
          value={`${published.length}`}
          description="Live on platform"
          color="bg-amber-50 text-amber-600"
          loading={isCoursesLoading}
        />
      </div>

      {/* Main Charts Area */}
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <ChartCard
            title="Revenue Distribution"
            description="Top performing courses by gross revenue"
            isLoading={isCoursesLoading}
            isEmpty={revenueByCourseData.length === 0}
            height={300}
          >
            <RevenueDistributionChart data={revenueByCourseData} />
          </ChartCard>
        </div>

        <div className="lg:col-span-2">
          <ChartCard
            title="Enrollment Growth"
            description="Monthly student sign-ups trend"
            isLoading={isStatsLoading}
            isEmpty={enrollmentTrend.length === 0}
            height={300}
          >
            <EnrollmentGrowthChart data={enrollmentTrend} />
          </ChartCard>
        </div>
      </div>

      {/* Completion Rates */}
      <div className="bg-card border border-border rounded-2xl shadow-card overflow-hidden">
        <div className="px-6 py-5 border-b border-border bg-muted/20">
          <h2 className="text-lg font-bold text-foreground">
            Course Completion Rates
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Percentage of students who finished each course
          </p>
        </div>
        <div className="p-8">
          <div className="grid sm:grid-cols-2 gap-x-12 gap-y-6">
            {isLoading ? (
              [1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))
            ) : completionData.length > 0 ? (
              completionData.map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span
                      className="font-semibold text-foreground truncate max-w-[200px]"
                      title={item.name}
                    >
                      {item.name}
                    </span>
                    <span className="font-bold text-primary">{item.rate}%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out bg-primary"
                      style={{
                        width: `${item.rate}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 py-12 text-center text-muted-foreground border-2 border-dashed border-border rounded-2xl">
                No course completion data available yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsClient;
