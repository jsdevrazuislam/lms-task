"use client";

import {
  TrendingUp,
  Users,
  BookOpen,
  BarChart3,
  ArrowUpRight,
  PieChart as PieChartIcon,
  Table as TableIcon,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RevenueAreaChart } from "@/features/super-admin/components/RevenueAreaChart";
import { UserDistributionPieChart } from "@/features/super-admin/components/UserDistributionPieChart";
import {
  useSuperAdminAnalytics,
  useSuperAdminStats,
} from "@/features/super-admin/hooks/useSuperAdmin";

export default function SuperAdminAnalyticsPage() {
  const { data: analyticsData, isLoading: isAnalyticsLoading } =
    useSuperAdminAnalytics();
  const { data: statsData, isLoading: isStatsLoading } = useSuperAdminStats();

  const stats = statsData;

  if (isAnalyticsLoading || isStatsLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-12 w-64 bg-muted rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-[400px] bg-muted rounded-3xl" />
          <div className="h-[400px] bg-muted rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
          Platform Analytics
        </h1>
        <p className="text-muted-foreground text-lg">
          Real-time data visualization and platform performance deep-dives.
        </p>
      </div>

      {/* Top Level KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Revenue Performance"
          value={`$${(stats?.totalRevenue || 0).toLocaleString()}`}
          icon={<BarChart3 className="w-6 h-6" />}
          color="bg-emerald-500/10 text-emerald-600"
          trend={{ value: "12.5%", isPositive: true }}
          description="Total processed revenue"
        />
        <StatCard
          title="Student Growth"
          value={stats?.students || 0}
          icon={<Users className="w-6 h-6" />}
          color="bg-blue-500/10 text-blue-600"
          trend={{ value: "8.2%", isPositive: true }}
          description="Total active students"
        />
        <StatCard
          title="Active Courses"
          value={stats?.activeCourses || 0}
          icon={<BookOpen className="w-6 h-6" />}
          color="bg-purple-500/10 text-purple-600"
          trend={{ value: "2.4%", isPositive: true }}
          description="Published content"
        />
        <StatCard
          title="Conversion Rate"
          value="3.8%"
          icon={<ArrowUpRight className="w-6 h-6" />}
          color="bg-orange-500/10 text-orange-600"
          trend={{ value: "0.5%", isPositive: false }}
          description="Lead to enrollment"
        />
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className=" border-none bg-card/60 backdrop-blur-sm rounded-3xl overflow-hidden">
          <CardHeader className="p-8 pb-4">
            <CardTitle className="text-2xl font-bold flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-primary" />
              User Sign-up Trend
            </CardTitle>
            <CardDescription>
              Monthly growth across all platform roles
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <RevenueAreaChart
              data={
                analyticsData?.userGrowth?.map((g) => ({
                  month: g.month,
                  revenue: g.total, // Reusing the area chart for growth trend
                })) || []
              }
            />
          </CardContent>
        </Card>

        <Card className=" border-none bg-card/60 backdrop-blur-sm rounded-3xl overflow-hidden">
          <CardHeader className="p-8 pb-4">
            <CardTitle className="text-2xl font-bold flex items-center gap-3">
              <PieChartIcon className="w-6 h-6 text-primary" />
              Revenue by Category
            </CardTitle>
            <CardDescription>
              Financial distribution across course categories
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <UserDistributionPieChart
              data={
                analyticsData?.categoryDistribution?.map((c) => ({
                  name: c.name,
                  value: c.revenue,
                })) || []
              }
            />
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Courses */}
      <Card className=" border-none bg-card/60 backdrop-blur-sm rounded-3xl overflow-hidden">
        <CardHeader className="p-8">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-3">
                <TableIcon className="w-6 h-6 text-primary" />
                Top Performing Courses
              </CardTitle>
              <CardDescription className="mt-1">
                Based on global revenue and enrollment metrics
              </CardDescription>
            </div>
            <Badge
              variant="outline"
              className="px-3 py-1 bg-primary/5 text-primary border-primary/20"
            >
              Q1 2026 TOP 5
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <div className="rounded-2xl border border-border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="font-bold">Course Title</TableHead>
                  <TableHead className="font-bold">Instructor</TableHead>
                  <TableHead className="font-bold text-center">
                    Enrollments
                  </TableHead>
                  <TableHead className="font-bold text-right">
                    Revenue
                  </TableHead>
                  <TableHead className="font-bold text-right">
                    Performance
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analyticsData?.topCourses?.map((course, idx) => (
                  <TableRow
                    key={course.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className="font-semibold py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs text-primary font-bold">
                          #{idx + 1}
                        </div>
                        {course.title}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {course.instructor}
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {course.enrollments}
                    </TableCell>
                    <TableCell className="text-right font-bold text-emerald-600">
                      ${course.revenue.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1 text-emerald-600 font-bold text-sm">
                        <TrendingUp className="w-4 h-4" />
                        High
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
