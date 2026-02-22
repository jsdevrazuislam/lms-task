"use client";

import {
  TrendingUp,
  Award,
  BookOpen,
  RefreshCcw,
  AlertCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { StatCard } from "@/components/dashboard/StatCard";
import ErrorBoundary from "@/components/shared/ErrorBoundary";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminDashboard } from "@/features/admin/hooks/useAdminDashboard";

const pieColors = [
  "hsl(239 84% 67%)",
  "hsl(262 83% 58%)",
  "hsl(210 80% 55%)",
  "hsl(150 60% 45%)",
  "hsl(30 90% 55%)",
];

const AdminAnalytics = () => {
  const { data, isLoading, error, refetch } = useAdminDashboard();

  const topCourse = data?.topCourses?.[0];
  const totalEnrollments =
    data?.topCourses?.reduce((sum, c) => sum + c.enrollments, 0) || 0;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertCircle className="w-12 h-12 text-destructive" />
        <div className="text-center">
          <h2 className="text-xl font-bold">Error Loading Analytics</h2>
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
              Analytics & Insights
            </h1>
            <p className="text-muted-foreground">
              Deep dive into course performance and student engagement.
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

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard
            title="Total Revenue"
            value={`$${data?.kpis.totalRevenue.toLocaleString() || "0"}`}
            icon={<TrendingUp className="w-6 h-6" />}
            loading={isLoading}
            description="lifetime platform revenue"
            color="bg-primary-muted text-primary"
          />
          <StatCard
            title="Top Performing Course"
            value={
              topCourse
                ? topCourse.title.split(" ").slice(0, 2).join(" ")
                : "---"
            }
            icon={<Award className="w-6 h-6" />}
            loading={isLoading}
            color="bg-secondary-muted text-secondary"
            description={topCourse?.title || "No data available"}
          />
          <StatCard
            title="Top Courses Enrollments"
            value={totalEnrollments.toLocaleString()}
            icon={<BookOpen className="w-6 h-6" />}
            loading={isLoading}
            description="sum of top 5 courses"
            color="bg-accent-muted text-accent"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Enrollment Breakdown Bar Chart */}
          <Card className="border-border  overflow-hidden">
            <CardHeader className="pb-4 bg-muted/20 border-b border-border/50">
              <CardTitle className="text-lg font-bold">
                Top Courses Enrollment
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-80">
                {isLoading ? (
                  <Skeleton className="w-full h-full rounded-xl" />
                ) : data?.topCourses && data.topCourses.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={data.topCourses}
                      layout="vertical"
                      margin={{ left: 10, right: 30 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="stroke-border"
                        horizontal={false}
                      />
                      <XAxis
                        type="number"
                        tick={{
                          fill: "var(--muted-foreground)",
                          fontSize: 11,
                        }}
                      />
                      <YAxis
                        dataKey="title"
                        type="category"
                        width={110}
                        tick={{
                          fill: "var(--muted-foreground)",
                          fontSize: 11,
                        }}
                      />
                      <Tooltip
                        formatter={(value: number) => [
                          value.toLocaleString(),
                          "Students",
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
                        dataKey="enrollments"
                        fill="var(--primary)"
                        radius={[0, 6, 6, 0]}
                        barSize={24}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6">
                    <BookOpen className="w-10 h-10 text-muted-foreground/30 mb-2" />
                    <p className="text-sm font-semibold text-foreground">
                      No course data yet
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Course performance will show here once students enroll.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Popular Courses Pie Chart */}
          <Card className="border-border  overflow-hidden">
            <CardHeader className="pb-4 bg-muted/20 border-b border-border/50">
              <CardTitle className="text-lg font-bold">
                Market Share Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-80">
                {isLoading ? (
                  <Skeleton className="w-full h-full rounded-xl" />
                ) : data?.topCourses && data.topCourses.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.topCourses.map((c) => ({
                          name: c.title,
                          value: c.enrollments,
                        }))}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={105}
                        paddingAngle={4}
                        dataKey="value"
                        label={({ percent }) =>
                          `${(percent * 100).toFixed(0)}%`
                        }
                        labelLine={false}
                      >
                        {data.topCourses.map((_, i) => (
                          <Cell
                            key={i}
                            fill={pieColors[i % pieColors.length]}
                            stroke="var(--background)"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => [
                          value.toLocaleString(),
                          "Students",
                        ]}
                        contentStyle={{
                          backgroundColor: "var(--background)",
                          border: "1px solid var(--border)",
                          borderRadius: "12px",
                          fontSize: 12,
                          boxShadow: "var(--shadow-lg)",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6">
                    <TrendingUp className="w-10 h-10 text-muted-foreground/30 mb-2" />
                    <p className="text-sm font-semibold text-foreground">
                      No market share data
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Waiting for initial course sales.
                    </p>
                  </div>
                )}
              </div>
              {/* Custom Legend */}
              <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-border">
                {data?.topCourses.map((c, i) => (
                  <div
                    key={c.title}
                    className="flex items-center gap-2 text-xs text-muted-foreground"
                  >
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{
                        backgroundColor: pieColors[i % pieColors.length],
                      }}
                    />
                    <span className="truncate">{c.title}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default AdminAnalytics;
