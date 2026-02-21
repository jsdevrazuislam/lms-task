"use client";

import {
  DollarSign,
  TrendingUp,
  ShoppingCart,
  AlertCircle,
  ChevronDown,
  ArrowUpRight,
  CreditCard,
} from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useState, useMemo } from "react";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { DataTable } from "@/components/shared/DataTable";
import { Skeleton } from "@/components/shared/SkeletonLoader";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useInstructorStats,
  useInstructorCourses,
} from "@/features/instructor/hooks/useInstructor";
import { IInstructorCourseStats as Course } from "@/features/instructor/services/instructor.service";

// Dynamically import chart
const RevenueTrendChart = dynamic(
  () => import("./components/RevenueTrendChart"),
  {
    loading: () => <Skeleton className="h-[320px] w-full rounded-xl" />,
    ssr: false,
  },
);

const DATE_RANGES = [
  { label: "Last 3 months", months: 3 },
  { label: "Last 6 months", months: 6 },
  { label: "Last 12 months", months: 12 },
];

function formatCurrency(v: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(v);
}

const RevenueClient = () => {
  const [dateRange, setDateRange] = useState(DATE_RANGES[2]);

  const { data: statsData, isLoading: isStatsLoading } = useInstructorStats();
  const { data: coursesData, isLoading: isCoursesLoading } =
    useInstructorCourses();

  const chartData = useMemo(
    () => (statsData?.revenueTrend || []).slice(-dateRange.months),
    [statsData, dateRange],
  );

  const totals = useMemo(() => {
    const gross = statsData?.totalRevenue || 0;
    const net = gross * 0.8; // Assuming 20% platform fee
    const refunds = 0;
    const sales = statsData?.totalStudents || 0;
    return { gross, net, refunds, sales };
  }, [statsData]);

  const columns = [
    {
      header: "Course",
      render: (row: Course) => (
        <div className="flex items-center gap-4 py-1">
          <div className="w-14 h-9 rounded-lg overflow-hidden ring-1 ring-border shrink-0 bg-muted shadow-sm relative">
            {row.thumbnail ? (
              <Image
                src={row.thumbnail}
                alt={row.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-xs">
                📚
              </div>
            )}
          </div>
          <p className="text-sm font-bold text-foreground line-clamp-1 max-w-[300px] group-hover:text-primary transition-colors">
            {row.title}
          </p>
        </div>
      ),
    },
    {
      header: "Sales",
      className: "text-right",
      thClassName: "text-right",
      render: (row: Course) => (
        <div className="flex flex-col items-end">
          <span className="text-sm font-bold text-foreground">
            {row.enrolledStudents.toLocaleString()}
          </span>
          <span className="text-[10px] text-muted-foreground">units sold</span>
        </div>
      ),
    },
    {
      header: "Gross",
      className: "text-right",
      thClassName: "text-right",
      render: (row: Course) => (
        <div className="flex flex-col items-end">
          <span className="text-sm font-extrabold text-foreground">
            {formatCurrency(row.revenue)}
          </span>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
            <ArrowUpRight className="w-2.5 h-2.5" /> 100%
          </span>
        </div>
      ),
    },
    {
      header: "Net Earned",
      className: "text-right",
      thClassName: "text-right",
      render: (row: Course) => (
        <div className="flex flex-col items-end">
          <span className="text-sm font-extrabold text-primary">
            {formatCurrency(row.revenue * 0.8)}
          </span>
          <span className="text-[10px] text-muted-foreground whitespace-nowrap">
            after 20% fee
          </span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Revenue Analysis
          </h1>
          <p className="text-muted-foreground mt-1.5">
            Monitor your earnings and sales performance.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="h-12 px-6 rounded-xl font-bold gap-2 shadow-sm border-border"
          >
            <CreditCard className="w-5 h-5 opacity-70" /> Payout Settings
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<DollarSign className="w-5 h-5" />}
          title="Total Gross"
          value={formatCurrency(totals.gross)}
          description="Before transaction fees"
          color="bg-primary/10 text-primary"
          loading={isStatsLoading}
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5" />}
          title="Net Earnings"
          value={formatCurrency(totals.net)}
          description="After 20% platform fee"
          color="bg-emerald-50 text-emerald-600"
          loading={isStatsLoading}
        />
        <StatCard
          icon={<ShoppingCart className="w-5 h-5" />}
          title="Total Sales"
          value={totals.sales.toLocaleString()}
          description="Volume of enrollments"
          color="bg-amber-50 text-amber-600"
          loading={isStatsLoading}
        />
        <StatCard
          icon={<AlertCircle className="w-5 h-5" />}
          title="Refunds"
          value={formatCurrency(totals.refunds)}
          description="Processed reversals"
          color="bg-destructive/5 text-destructive"
          loading={isStatsLoading}
        />
      </div>

      {/* Monthly Trend Chart */}
      <ChartCard
        title="Revenue Trend"
        description="Monthly gross revenue performance"
        isLoading={isStatsLoading}
        isEmpty={chartData.length === 0}
        height={320}
        action={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-10 px-4 gap-2 rounded-xl text-xs font-bold border-border bg-background"
              >
                {dateRange.label}
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 bg-popover border border-border shadow-elevated rounded-2xl p-2 z-50"
            >
              {DATE_RANGES.map((r) => (
                <DropdownMenuItem
                  key={r.months}
                  onClick={() => setDateRange(r)}
                  className={`px-3 py-2.5 rounded-xl cursor-pointer text-sm font-semibold ${dateRange.months === r.months ? "text-primary bg-primary-muted" : ""}`}
                >
                  {r.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        }
      >
        <RevenueTrendChart data={chartData} />
      </ChartCard>

      {/* Detailed Table Breakdown */}
      <div className="space-y-4">
        <div className="px-1">
          <h2 className="text-lg font-bold text-foreground">
            Revenue by Course
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Detailed breakdown of sales and earnings
          </p>
        </div>

        <DataTable
          columns={columns}
          data={coursesData || []}
          isLoading={isCoursesLoading}
          emptyState={{
            icon: DollarSign,
            title: "No revenue generated",
            description:
              "When you start selling courses, you'll see a detailed breakdown here.",
          }}
        />
      </div>
    </div>
  );
};

export default RevenueClient;
