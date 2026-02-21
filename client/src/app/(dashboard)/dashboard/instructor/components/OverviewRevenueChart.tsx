"use client";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface OverviewRevenueChartProps {
  data: { name: string; revenue: number }[];
}

const OverviewRevenueChart = ({ data }: OverviewRevenueChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.15} />
            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="var(--border)"
          opacity={0.6}
        />
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{
            fill: "var(--muted-foreground)",
            fontSize: 12,
            fontWeight: 500,
          }}
          dy={12}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{
            fill: "var(--muted-foreground)",
            fontSize: 12,
            fontWeight: 500,
          }}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          contentStyle={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            fontSize: 12,
            boxShadow: "var(--shadow-elevated)",
          }}
          itemStyle={{ fontWeight: 600 }}
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
  );
};

export default OverviewRevenueChart;
