"use client";

import {
  Users,
  GraduationCap,
  BookOpen,
  DollarSign,
  Crown,
  RefreshCcw,
  AlertCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { StatCard } from "@/components/dashboard/StatCard";
import ErrorBoundary from "@/components/shared/ErrorBoundary";
import {
  StatCardSkeleton,
  TableRowSkeleton,
  Skeleton,
} from "@/components/shared/SkeletonLoader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminDashboard } from "@/features/admin/hooks/useAdminDashboard";

const AdminDashboard = () => {
  const { data, isLoading, error, refetch } = useAdminDashboard();

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertCircle className="w-12 h-12 text-destructive" />
        <div className="text-center">
          <h2 className="text-xl font-bold">Error Loading Dashboard</h2>
          <p className="text-muted-foreground">
            {error?.message || "An unexpected error occurred"}
          </p>
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
        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold tracking-tight">
              Admin Overview
            </h1>
            <p className="text-muted-foreground">
              Monitor platform performance and key metrics at a glance.
            </p>
          </div>
          <Button
            onClick={() => refetch()}
            variant="ghost"
            size="sm"
            className="gap-2"
            disabled={isLoading}
          >
            <RefreshCcw
              className={isLoading ? "animate-spin w-4 h-4" : "w-4 h-4"}
            />
            Refresh
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <StatCardSkeleton key={i} />
            ))
          ) : (
            <>
              <StatCard
                title="Active Students"
                value={data?.kpis.activeStudents ?? 0}
                icon={<Users className="w-6 h-6" />}
                color="bg-accent-muted text-accent"
              />
              <StatCard
                title="Instructors"
                value={data?.kpis.instructors ?? 0}
                icon={<GraduationCap className="w-6 h-6" />}
                color="bg-primary-muted text-primary"
              />
              <StatCard
                title="Total Courses"
                value={data?.kpis.totalCourses ?? 0}
                icon={<BookOpen className="w-6 h-6" />}
                color="bg-secondary-muted text-secondary"
              />
              <StatCard
                title="Total Revenue"
                value={`$${((data?.kpis.totalRevenue ?? 0) / 1000).toFixed(1)}k`}
                icon={<DollarSign className="w-6 h-6" />}
                color="bg-warning-muted text-warning"
              />
            </>
          )}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-border  overflow-hidden">
            <CardHeader className="pb-4 bg-muted/20 border-b border-border/50">
              <CardTitle className="text-lg font-bold">
                Enrollment Growth (Last 10 Days)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-72">
                {isLoading ? (
                  <Skeleton className="w-full h-full" />
                ) : data?.enrollmentTrend.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    No enrollment data available
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data?.enrollmentTrend}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="stroke-border"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="date"
                        className="text-xs"
                        tick={{
                          fill: "var(--muted-foreground)",
                          fontSize: 11,
                        }}
                      />
                      <YAxis
                        tick={{
                          fill: "var(--muted-foreground)",
                          fontSize: 11,
                        }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--background)",
                          border: "1px solid var(--border)",
                          borderRadius: "12px",
                          fontSize: 12,
                          boxShadow: "var(--shadow-lg)",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="students"
                        stroke="var(--primary)"
                        strokeWidth={3}
                        dot={{
                          fill: "var(--primary)",
                          r: 4,
                          strokeWidth: 2,
                          stroke: "#fff",
                        }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border  overflow-hidden">
            <CardHeader className="pb-4 bg-muted/20 border-b border-border/50">
              <CardTitle className="text-lg font-bold">
                Revenue Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-72">
                {isLoading ? (
                  <Skeleton className="w-full h-full" />
                ) : data?.revenueSummary.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    No revenue data available
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data?.revenueSummary}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="stroke-border"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="month"
                        tick={{
                          fill: "var(--muted-foreground)",
                          fontSize: 11,
                        }}
                      />
                      <YAxis
                        tick={{
                          fill: "var(--muted-foreground)",
                          fontSize: 11,
                        }}
                        tickFormatter={(v) => `$${v / 1000}k`}
                      />
                      <Tooltip
                        formatter={(value: number) => [
                          `$${value.toLocaleString()}`,
                          "Revenue",
                        ]}
                        contentStyle={{
                          backgroundColor: "var(--background)",
                          border: "1px solid var(--border)",
                          borderRadius: "12px",
                          fontSize: 12,
                          boxShadow: "var(--shadow-lg)",
                        }}
                      />
                      <Bar
                        dataKey="revenue"
                        fill="url(#colorRevenue)"
                        radius={[6, 6, 0, 0]}
                      />
                      <defs>
                        <linearGradient
                          id="colorRevenue"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="var(--primary)"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="var(--primary)"
                            stopOpacity={0.3}
                          />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Courses */}
        <Card className="border-border  overflow-hidden">
          <CardHeader className="pb-4 bg-muted/20 border-b border-border/50">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Crown className="w-5 h-5 text-warning" />
              Top Performing Courses
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRowSkeleton key={i} cols={3} />
                ))
              ) : data?.topCourses.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  No course data available
                </div>
              ) : (
                data?.topCourses.map((course, i) => (
                  <div
                    key={course.title}
                    className="flex items-center gap-4 p-5 hover:bg-muted/30 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary-muted text-primary flex items-center justify-center text-sm font-extrabold shrink-0 group-hover:scale-110 transition-transform">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-foreground truncate">
                        {course.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {course.instructor}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-foreground tabular-nums">
                        {course.enrollments}
                      </p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                        Enrollments
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </ErrorBoundary>
  );
};

export default AdminDashboard;
