import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted/50", className)}
      {...props}
    />
  );
}

export function NavUserSkeleton() {
  return (
    <div className="flex items-center gap-2 p-1">
      <Skeleton className="h-9 w-9 rounded-xl" />
      <div className="hidden lg:flex flex-col gap-1.5">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-2 w-12" />
      </div>
      <Skeleton className="h-3.5 w-3.5 ml-1" />
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl border border-border p-6 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <Skeleton className="h-4 w-12" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <div className="flex items-center gap-4 px-6 py-4 border-b border-border/50">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn("h-4 flex-1", i === 0 && "flex-[1.5]")}
        />
      ))}
    </div>
  );
}

export function DashboardContentSkeleton() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
      <div className="rounded-3xl border border-border bg-card overflow-hidden ">
        <div className="p-6 border-b border-border">
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="p-2">
          <TableRowSkeleton />
          <TableRowSkeleton />
          <TableRowSkeleton />
          <TableRowSkeleton />
        </div>
      </div>
    </div>
  );
}
