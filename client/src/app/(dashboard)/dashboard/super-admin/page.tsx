"use client";

import {
  Users,
  BookOpen,
  DollarSign,
  MoreHorizontal,
  Search,
  Filter,
  ShieldCheck,
  Activity,
  Eye,
  Settings,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { StatCard } from "@/components/dashboard/StatCard";
import ErrorBoundary from "@/components/shared/ErrorBoundary";
import {
  StatCardSkeleton,
  TableRowSkeleton,
} from "@/components/shared/SkeletonLoader";
import { useCourses } from "@/features/course/hooks/useCourses";
import { ICourse } from "@/features/course/types";

const enrollmentData = [
  { month: "Jan", enrollments: 1200, revenue: 48000 },
  { month: "Feb", enrollments: 1500, revenue: 62000 },
  { month: "Mar", enrollments: 1800, revenue: 75000 },
  { month: "Apr", enrollments: 2200, revenue: 92000 },
  { month: "May", enrollments: 2600, revenue: 110000 },
  { month: "Jun", enrollments: 3200, revenue: 135000 },
];

export default function SuperAdminDashboard() {
  const { data: coursesData, isLoading } = useCourses({ limit: 5 });

  return (
    <ErrorBoundary>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">System Overview</h1>
            <p className="text-muted-foreground mt-1">
              Platform-wide analytics and management.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card text-sm font-semibold hover:bg-muted transition-all">
              <Settings className="w-4 h-4" />
              System Settings
            </button>
          </div>
        </div>

        {/* Highlights */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {isLoading ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : (
            <>
              <StatCard
                title="Total Revenue"
                value="$842.5K"
                trend={{ value: "+18.4%", isPositive: true }}
                description="this quarter"
                icon={<DollarSign className="w-5 h-5 text-primary" />}
              />
              <StatCard
                title="Platform Users"
                value="124.8K"
                trend={{ value: "+4.2K", isPositive: true }}
                description="this month"
                icon={<Users className="w-5 h-5 text-success" />}
              />
              <StatCard
                title="Total Courses"
                value={coursesData?.meta.total.toLocaleString() || "0"}
                icon={<BookOpen className="w-5 h-5 text-accent" />}
              />
              <StatCard
                title="System Health"
                value="99.9%"
                trend={{ value: "Stable", isPositive: true }}
                icon={<Activity className="w-5 h-5 text-success" />}
              />
            </>
          )}
        </div>

        {/* Main Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-semibold text-lg">Growth Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  Enrollments vs Revenue growth
                </p>
              </div>
            </div>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={enrollmentData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "hsl(var(--muted-foreground))",
                      fontSize: 12,
                    }}
                  />
                  <YAxis
                    yAxisId="left"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "hsl(var(--muted-foreground))",
                      fontSize: 12,
                    }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "hsl(var(--muted-foreground))",
                      fontSize: 12,
                    }}
                    tickFormatter={(v) => `$${v / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="enrollments"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{
                      r: 4,
                      fill: "hsl(var(--primary))",
                      strokeWidth: 2,
                      stroke: "white",
                    }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--secondary))"
                    strokeWidth={3}
                    dot={{
                      r: 4,
                      fill: "hsl(var(--secondary))",
                      strokeWidth: 2,
                      stroke: "white",
                    }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-6">
            {/* Security status */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-success" />
                Security Status
              </h3>
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-success-muted border border-success/20">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-success">
                      SSL Certificate
                    </span>
                    <span className="text-[10px] bg-success text-white px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    Expires in 284 days
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-muted border border-border">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold">Firewall</span>
                    <span className="text-[10px] bg-muted-foreground text-white px-2 py-0.5 rounded-full">
                      Optimized
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    No threats detected today
                  </p>
                </div>
              </div>
              <button className="w-full mt-4 py-2 text-xs font-bold text-primary hover:underline">
                Run Security Audit
              </button>
            </div>

            {/* Storage usage */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="font-semibold mb-4">Storage Usage</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">
                    Media & Video Assets
                  </span>
                  <span className="font-bold">642 GB / 1 TB</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: "64.2%" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Large table section */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="px-6 py-5 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Platform Resources</h3>
              <p className="text-sm text-muted-foreground">
                Manage and monitor all hosted content
              </p>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-muted border-none rounded-lg pl-9 pr-4 py-1.5 text-xs focus:ring-1 focus:ring-primary outline-none"
                />
              </div>
              <button className="p-1.5 rounded-lg border border-border hover:bg-muted">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Course Name
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <>
                    <TableRowSkeleton cols={5} />
                    <TableRowSkeleton cols={5} />
                    <TableRowSkeleton cols={5} />
                  </>
                ) : (
                  coursesData?.data.map((c: ICourse) => (
                    <tr
                      key={c.id}
                      className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-linear-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {c.title[0]}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold truncate max-w-[200px]">
                              {c.title}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              Cat ID: {c.categoryId}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-mono text-muted-foreground">
                          {c.id.slice(0, 8)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`badge-${c.status === "PUBLISHED" ? "success" : c.status === "DRAFT" ? "warning" : "destructive"}`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-foreground">
                        ${c.price}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1.5 rounded-lg hover:bg-primary/10 text-primary">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-muted">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-border flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Showing {coursesData?.data.length || 0} of{" "}
              {coursesData?.meta.total || 0} courses
            </span>
            <div className="flex items-center gap-1">
              <button className="px-3 py-1 rounded border border-border text-xs disabled:opacity-50">
                Prev
              </button>
              <button className="px-3 py-1 rounded bg-primary text-white text-xs">
                1
              </button>
              <button className="px-3 py-1 rounded border border-border text-xs">
                2
              </button>
              <button className="px-3 py-1 rounded border border-border text-xs">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
