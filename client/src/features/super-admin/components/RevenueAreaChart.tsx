"use client";

import { TrendingUp } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { IRevenueTrend } from "../types";

interface RevenueAreaChartProps {
  data: IRevenueTrend[];
  isLoading?: boolean;
}

export function RevenueAreaChart({ data, isLoading }: RevenueAreaChartProps) {
  if (isLoading) {
    return (
      <div className="h-[350px] w-full bg-muted/20 animate-pulse rounded-xl" />
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-[350px] w-full flex flex-col items-center justify-center border border-dashed border-border rounded-2xl bg-muted/5">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
          <TrendingUp className="w-6 h-6 text-muted-foreground/40" />
        </div>
        <p className="text-sm font-semibold text-foreground">No revenue data</p>
        <p className="text-xs text-muted-foreground mt-1">
          Growth metrics will appear here once sales begin.
        </p>
      </div>
    );
  }

  // Add TrendingUp import at top

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="var(--border)"
          />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--card)",
              borderColor: "var(--border)",
              borderRadius: "12px",
              fontSize: "12px",
            }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="var(--primary)"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorRevenue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
