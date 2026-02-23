"use client";

import { Users } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface EnrollmentGrowthChartProps {
  data: { date: string; count: number }[];
  isLoading?: boolean;
}

export function EnrollmentGrowthChart({
  data,
  isLoading,
}: EnrollmentGrowthChartProps) {
  if (isLoading) {
    return (
      <div className="h-[350px] w-full bg-muted/20 animate-pulse rounded-xl" />
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-[350px] w-full flex flex-col items-center justify-center border border-dashed border-border rounded-2xl bg-muted/5">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
          <Users className="w-6 h-6 text-muted-foreground/40" />
        </div>
        <p className="text-sm font-semibold text-foreground">
          No enrollment data
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Growth metrics will appear here once students join.
        </p>
      </div>
    );
  }

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorEnrollment" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="var(--border)"
          />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
            dy={10}
            tickFormatter={(str) => {
              try {
                const date = new Date(str);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              } catch {
                return str;
              }
            }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--card)",
              borderColor: "var(--border)",
              borderRadius: "12px",
              fontSize: "12px",
            }}
            labelFormatter={(label) => {
              try {
                return new Date(label).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                });
              } catch {
                return label;
              }
            }}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#10b981"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorEnrollment)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
