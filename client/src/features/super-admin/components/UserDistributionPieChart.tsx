"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface UserDistributionPieChartProps {
  data: { name: string; value: number }[];
  isLoading?: boolean;
}

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444"];

export function UserDistributionPieChart({
  data,
  isLoading,
}: UserDistributionPieChartProps) {
  if (isLoading) {
    return (
      <div className="h-[300px] w-full bg-muted/20 animate-pulse rounded-full" />
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] w-full flex flex-col items-center justify-center border border-dashed border-border rounded-md bg-muted/5 translate-y-[-10px]">
        <p className="text-sm font-semibold text-foreground">No data</p>
        <p className="text-[10px] text-muted-foreground mt-1">
          Check back later
        </p>
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--card)",
              borderColor: "var(--border)",
              borderRadius: "12px",
            }}
          />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
