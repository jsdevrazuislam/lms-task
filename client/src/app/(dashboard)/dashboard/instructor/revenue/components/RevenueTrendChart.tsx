"use client";
import { TrendingUp as TrendingUpIcon } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface RevenueTrendChartProps {
  data: { name: string; revenue: number }[];
}

const formatCurrency = (v: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(v);
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-popover border border-border shadow-elevated rounded-2xl p-4 min-w-[150px] border-l-4 border-l-primary">
      <p className="text-xs font-bold text-muted-foreground mb-2">{label}</p>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-4">
          <span className="text-[11px] font-medium text-muted-foreground">
            Revenue
          </span>
          <span className="text-sm font-extrabold text-foreground">
            {formatCurrency(payload[0].value)}
          </span>
        </div>
      </div>
    </div>
  );
};

const RevenueTrendChart = ({ data }: RevenueTrendChartProps) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center space-y-2 py-10 opacity-60">
        <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
          <TrendingUpIcon className="w-6 h-6 text-muted-foreground" />
        </div>
        <p className="text-sm font-semibold text-foreground">
          No revenue trend data
        </p>
        <p className="text-[10px] text-muted-foreground">
          Earnings will appear here monthly
        </p>
      </div>
    );
  }
  return (
    <div className="w-full h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.25} />
              <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--border)"
            vertical={false}
          />
          <XAxis
            dataKey="name"
            tick={{
              fontSize: 11,
              fontWeight: 600,
              fill: "var(--muted-foreground)",
            }}
            axisLine={false}
            tickLine={false}
            dy={10}
          />
          <YAxis
            tickFormatter={(v) =>
              `$${v >= 1000 ? (v / 1000).toFixed(0) + "k" : v}`
            }
            tick={{
              fontSize: 11,
              fontWeight: 600,
              fill: "var(--muted-foreground)",
            }}
            axisLine={false}
            tickLine={false}
            dx={-10}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{
              stroke: "var(--primary)",
              strokeWidth: 1,
              strokeDasharray: "4 4",
            }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="var(--primary)"
            strokeWidth={3}
            fill="url(#revenueGrad)"
            dot={{
              r: 4,
              fill: "var(--background)",
              stroke: "var(--primary)",
              strokeWidth: 2,
            }}
            activeDot={{
              r: 6,
              fill: "var(--primary)",
              stroke: "var(--background)",
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueTrendChart;
