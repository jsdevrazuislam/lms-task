"use client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface EnrollmentGrowthChartProps {
  data: { name: string; students: number }[];
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

const EnrollmentGrowthChart = ({ data }: EnrollmentGrowthChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
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
          tick={{
            fontSize: 10,
            fontWeight: 600,
            fill: "hsl(var(--muted-foreground))",
          }}
          axisLine={false}
          tickLine={false}
          width={30}
        />
        <Tooltip content={<ChartTooltip unit=" students" />} />
        <Line
          type="monotone"
          dataKey="students"
          stroke="hsl(var(--primary))"
          strokeWidth={3}
          dot={{
            r: 4,
            fill: "hsl(var(--background))",
            stroke: "hsl(var(--primary))",
            strokeWidth: 2,
          }}
          activeDot={{
            r: 6,
            fill: "hsl(var(--primary))",
            stroke: "hsl(var(--background))",
            strokeWidth: 2,
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default EnrollmentGrowthChart;
