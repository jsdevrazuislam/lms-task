"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface RevenueDistributionChartProps {
  data: { name: string; revenue: number }[];
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
  unit?: string;
}

const ChartTooltip = ({
  active,
  payload,
  label,
  unit = "",
}: ChartTooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-popover border border-border shadow-elevated rounded-2xl p-4 min-w-[140px] border-l-4 border-l-primary">
      <p className="text-xs font-bold text-muted-foreground mb-2 truncate max-w-[180px]">
        {label}
      </p>
      <div className="flex items-center justify-between gap-4">
        <span className="text-[11px] font-medium text-muted-foreground">
          Value
        </span>
        <span className="text-sm font-extrabold text-foreground">
          {payload[0].value}
          {unit}
        </span>
      </div>
    </div>
  );
};

const RevenueDistributionChart = ({ data }: RevenueDistributionChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        barSize={36}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="hsl(var(--border))"
          vertical={false}
        />
        <XAxis
          dataKey="name"
          tick={{
            fontSize: 10,
            fontWeight: 600,
            fill: "hsl(var(--muted-foreground))",
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
            fontSize: 10,
            fontWeight: 600,
            fill: "hsl(var(--muted-foreground))",
          }}
          axisLine={false}
          tickLine={false}
          width={40}
        />
        <Tooltip
          content={<ChartTooltip />}
          cursor={{ fill: "hsl(var(--accent)/0.5)" }}
        />
        <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={`hsl(var(--primary) / ${1 - i * 0.12})`} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default RevenueDistributionChart;
