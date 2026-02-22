"use client";

import {
  Users,
  GraduationCap,
  PlayCircle,
  DollarSign,
  Activity,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RevenueAreaChart } from "@/features/super-admin/components/RevenueAreaChart";
import { UserDistributionPieChart } from "@/features/super-admin/components/UserDistributionPieChart";
import {
  useSuperAdminStats,
  useSuperAdminRevenueTrend,
} from "@/features/super-admin/hooks/useSuperAdmin";

export default function SuperAdminDashboard() {
  const { data: stats, isLoading: isStatsLoading } = useSuperAdminStats();
  const { data: revenueTrend, isLoading: isTrendLoading } =
    useSuperAdminRevenueTrend();

  const userDistribution = stats
    ? [
        { name: "Students", value: stats.students },
        { name: "Instructors", value: stats.instructors },
        { name: "Admins", value: stats.admins },
      ]
    : [];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Platform Overview</h1>
        <p className="text-muted-foreground mt-1">
          Global performance and health metrics for LearnFlow.
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          loading={isStatsLoading}
          icon={<Users className="w-6 h-6" />}
          color="bg-blue-500/10 text-blue-600"
          description="Active accounts across all roles"
        />
        <StatCard
          title="Total Revenue"
          value={`$${(stats?.totalRevenue || 0).toLocaleString()}`}
          loading={isStatsLoading}
          icon={<DollarSign className="w-6 h-6" />}
          color="bg-emerald-500/10 text-emerald-600"
          description="All-time processed payments"
        />
        <StatCard
          title="Active Courses"
          value={stats?.activeCourses || 0}
          loading={isStatsLoading}
          icon={<PlayCircle className="w-6 h-6" />}
          color="bg-purple-500/10 text-purple-600"
          description="Published and available content"
        />
        <StatCard
          title="Total Instructors"
          value={stats?.instructors || 0}
          loading={isStatsLoading}
          icon={<GraduationCap className="w-6 h-6" />}
          color="bg-orange-500/10 text-orange-600"
          description="Platform content creators"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 ">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Revenue Trend (YTD)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueAreaChart
              data={revenueTrend || []}
              isLoading={isTrendLoading}
            />
          </CardContent>
        </Card>

        <Card className="">
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <UserDistributionPieChart
              data={userDistribution}
              isLoading={isStatsLoading}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
