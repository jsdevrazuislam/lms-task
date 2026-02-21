import { BarChart3, Info } from "lucide-react";
import React from "react";
import { EmptyState } from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/shared/SkeletonLoader";

interface ChartCardProps {
  title: string;
  description?: string;
  isLoading?: boolean;
  isEmpty?: boolean;
  children: React.ReactNode;
  height?: number | string;
  action?: React.ReactNode;
}

export const ChartCard = ({
  title,
  description,
  isLoading,
  isEmpty,
  children,
  height = 350,
  action,
}: ChartCardProps) => {
  return (
    <div className="bg-card border border-border rounded-2xl shadow-card overflow-hidden flex flex-col h-full animate-fade-in">
      {/* Header */}
      <div className="px-6 py-5 border-b border-border bg-muted/10 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-foreground truncate">
            {title}
          </h3>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {description}
            </p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>

      {/* Content Body */}
      <div className="flex-1 p-6 relative" style={{ minHeight: height }}>
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 space-y-4">
            <Skeleton className="w-full h-full rounded-xl" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          </div>
        ) : isEmpty ? (
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <EmptyState
              icon={BarChart3}
              title="No Data Available"
              description="There isn't enough data yet to generate this visualization."
              className="border-none shadow-none bg-transparent py-0"
            />
          </div>
        ) : (
          <div className="w-full h-full animate-in fade-in duration-700">
            {children}
          </div>
        )}
      </div>

      {/* Optional Footer/Hint */}
      {!isLoading && !isEmpty && (
        <div className="px-6 py-3 bg-muted/5 border-t border-border/50 flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-muted-foreground/60" />
          <span className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-widest">
            Real-time visualization
          </span>
        </div>
      )}
    </div>
  );
};
