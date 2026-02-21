"use client";

import {
  BookOpen,
  Users,
  BarChart2,
  Plus,
  Settings,
  Clock,
  MessageSquare,
  Layers,
  DollarSign,
} from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { EmptyState } from "@/components/shared/EmptyState";
import ErrorBoundary from "@/components/shared/ErrorBoundary";
import { StatCardSkeleton, Skeleton } from "@/components/shared/SkeletonLoader";
import {
  useInstructorStats,
  useInstructorCourses,
} from "@/features/instructor/hooks/useInstructor";

// Dynamically import heavy charts to improve initial load time
const AreaChartComp = dynamic(
  () => import("./components/OverviewRevenueChart"),
  {
    loading: () => <Skeleton className="h-[320px] w-full rounded-xl" />,
    ssr: false, // Charts usually need client-side window object
  },
);

export default function InstructorDashboardClient() {
  const { data: stats, isLoading: isStatsLoading } = useInstructorStats();
  const { data: myCourses, isLoading: isCoursesLoading } =
    useInstructorCourses();

  const revenueData = stats?.dailyTrend || [];
  const isLoading = isStatsLoading || isCoursesLoading;

  return (
    <ErrorBoundary>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Instructor Dashboard
            </h1>
            <p className="text-muted-foreground mt-1.5">
              Track your course performance and student engagement.
            </p>
          </div>
          <Link href="/dashboard/instructor/courses/new">
            <button className="flex items-center cursor-pointer justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold transition-all hover:opacity-90 shadow-elevated">
              <Plus className="w-5 h-5" />
              Create New Course
            </button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <StatCardSkeleton key={i} />
            ))
          ) : (
            <>
              <StatCard
                title="Total Students"
                value={stats?.totalStudents?.toLocaleString() || "0"}
                trend={{ value: "+0%", isPositive: true }}
                description="Overall enrollment across all courses"
                icon={<Users className="w-5 h-5" />}
                color="bg-primary/10 text-primary"
              />
              <StatCard
                title="Avg. Rating"
                value={stats?.avgRating?.toFixed(1) || "0.0"}
                description={`Based on ${stats?.totalCourses || 0} courses`}
                icon={<BarChart2 className="w-5 h-5" />}
                color="bg-emerald-50 text-emerald-600"
              />
              <StatCard
                title="Total Revenue"
                value={`$${stats?.totalRevenue?.toLocaleString() || "0"}`}
                trend={{ value: "+0%", isPositive: true }}
                description="Lifetime earnings from sales"
                icon={<DollarSign className="w-5 h-5" />}
                color="bg-amber-50 text-amber-600"
              />
              <StatCard
                title="Total Courses"
                value={stats?.totalCourses?.toString() || "0"}
                description="Published and draft courses"
                icon={<BookOpen className="w-5 h-5" />}
                color="bg-blue-50 text-blue-600"
              />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-2">
            <ChartCard
              title="Revenue Overview"
              description="Weekly earnings breakdown"
              isLoading={isStatsLoading}
              isEmpty={revenueData.length === 0}
              height={320}
            >
              <AreaChartComp data={revenueData} />
            </ChartCard>
          </div>

          {/* Recent courses */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-card">
            <div className="px-8 py-6 border-b border-border flex items-center justify-between">
              <h3 className="font-bold text-lg">Your Courses</h3>
              <Link href="/dashboard/instructor/courses">
                <button className="text-sm cursor-pointer text-primary font-bold hover:text-primary/80 transition-colors">
                  View All
                </button>
              </Link>
            </div>
            <div className="divide-y divide-border">
              {isLoading ? (
                <div className="p-6 space-y-6">
                  <Skeleton className="h-20 w-full rounded-xl" />
                  <Skeleton className="h-20 w-full rounded-xl" />
                  <Skeleton className="h-20 w-full rounded-xl" />
                </div>
              ) : myCourses && myCourses.length > 0 ? (
                myCourses.slice(0, 5).map((c, idx) => (
                  <div
                    key={c.id}
                    className="p-6 hover:bg-muted/30 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center shrink-0 relative overflow-hidden shadow-sm ring-1 ring-border">
                        {c.thumbnail ? (
                          <Image
                            src={c.thumbnail}
                            alt={c.title}
                            fill
                            className="object-cover"
                            priority={idx < 2} // Priority for top few items
                          />
                        ) : (
                          <span className="text-xl">📚</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate group-hover:text-primary transition-colors">
                          {c.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            ${c.price}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-border" />
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            {c.status}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-border" />
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            {c.enrolledStudents} std.
                          </span>
                        </div>
                      </div>
                      <Link href={`/dashboard/instructor/courses/${c.id}/edit`}>
                        <button className="p-2.5 rounded-xl hover:bg-muted text-muted-foreground transition-colors border border-transparent hover:border-border">
                          <Settings className="w-4.5 h-4.5" />
                        </button>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState
                  icon={BookOpen}
                  title="No courses yet"
                  description="Start creating your first course to share your knowledge."
                  action={{
                    label: "Create Course",
                    onClick: () =>
                      (window.location.href =
                        "/dashboard/instructor/courses/new"),
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Quick actions & engagement */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: MessageSquare,
              label: "Unread messages",
              desc: "12 new from students",
              color: "text-primary",
            },
            {
              icon: Clock,
              label: "Questions asked",
              desc: "5 pending your reply",
              color: "text-amber-500",
            },
            {
              icon: Layers,
              label: "Curriculum update",
              desc: "Finalize module 4",
              color: "text-emerald-500",
            },
            {
              icon: Users,
              label: "View students",
              desc: "Enrolled in 5 courses",
              color: "text-blue-500",
            },
          ].map(({ icon: Icon, label, desc, color }) => (
            <button
              key={label}
              className="w-full flex items-center gap-4 p-4 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-md transition-all text-left group"
            >
              <div className="w-11 h-11 rounded-xl bg-muted/50 flex items-center justify-center shrink-0 group-hover:bg-primary-muted transition-colors">
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <p className="text-sm font-bold">{label}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {desc}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </ErrorBoundary>
  );
}
