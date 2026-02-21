import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  description?: string;
  sub?: string;
  color?: string;
  className?: string;
  loading?: boolean;
}

export function StatCard({
  title,
  value,
  icon,
  trend,
  description,
  sub,
  color,
  className,
  loading,
}: StatCardProps) {
  if (loading) {
    return (
      <div
        className={cn(
          "p-6 rounded-2xl border border-border bg-card animate-pulse",
          className,
        )}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-muted" />
        </div>
        <div className="space-y-3">
          <div className="h-3 w-20 bg-muted rounded" />
          <div className="h-8 w-24 bg-muted rounded" />
          <div className="h-3 w-32 bg-muted rounded" />
        </div>
      </div>
    );
  }
  return (
    <div
      className={cn(
        "p-6 rounded-2xl border border-border bg-card hover:shadow-elevated transition-all duration-300 group",
        className,
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
            color || "bg-primary-muted text-primary",
          )}
        >
          {icon}
        </div>
        {trend && (
          <div
            className={cn(
              "flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold",
              trend.isPositive
                ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                : "bg-destructive/10 text-destructive border border-destructive/20",
            )}
          >
            {trend.isPositive ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" />
            )}
            {trend.value}
          </div>
        )}
      </div>
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1.5">
          {title}
        </p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-bold text-foreground tracking-tight">
            {value}
          </h3>
          {sub && (
            <span className="text-xs font-medium text-muted-foreground">
              {sub}
            </span>
          )}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5">
            <Minus className="w-3 h-3 opacity-40" />
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
