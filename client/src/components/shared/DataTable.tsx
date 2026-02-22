import {
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
  HelpCircle,
} from "lucide-react";
import React, { type ReactNode } from "react";
import { EmptyState } from "@/components/shared/EmptyState";
import { Skeleton } from "@/components/shared/SkeletonLoader";
import { Button } from "@/components/ui/button";

export interface Column<T> {
  header: string;
  accessor?: keyof T;
  render?: (item: T) => ReactNode;
  className?: string;
  thClassName?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyState?: {
    icon: LucideIcon;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
  };
  pagination?: {
    totalItems: number;
    pageSize: number;
    currentPage: number;
    onPageChange: (page: number) => void;
  };
}

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  isLoading,
  emptyState,
  pagination,
}: DataTableProps<T>) {
  const totalPages = pagination
    ? Math.ceil(pagination.totalItems / pagination.pageSize)
    : 0;

  return (
    <div className="bg-card border border-border rounded-2xl shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/40 border-b border-border">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-widest ${col.thClassName || ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={columns.length} className="px-6 py-4">
                    <Skeleton className="h-10 w-full rounded-lg" />
                  </td>
                </tr>
              ))
            ) : data.length > 0 ? (
              data.map((item) => (
                <tr
                  key={item.id}
                  className="group hover:bg-muted/30 transition-colors duration-150"
                >
                  {columns.map((col, idx) => (
                    <td
                      key={idx}
                      className={`px-6 py-4 ${col.className || ""}`}
                    >
                      {col.render
                        ? col.render(item)
                        : (item[col.accessor!] as ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="p-0">
                  <EmptyState
                    icon={emptyState?.icon || HelpCircle}
                    title={emptyState?.title || "No data available"}
                    description={
                      emptyState?.description ||
                      "Try adjusting your filters or search."
                    }
                    action={
                      emptyState?.onAction
                        ? {
                            label: emptyState.actionLabel || "Add New",
                            onClick: emptyState.onAction,
                          }
                        : undefined
                    }
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination &&
        data.length > 0 &&
        pagination.totalItems > pagination.pageSize && (
          <div className="px-6 py-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground font-medium">
              Showing{" "}
              <span className="font-bold text-foreground">
                {(pagination.currentPage - 1) * pagination.pageSize + 1}
              </span>{" "}
              to{" "}
              <span className="font-bold text-foreground">
                {Math.min(
                  pagination.currentPage * pagination.pageSize,
                  pagination.totalItems,
                )}
              </span>{" "}
              of{" "}
              <span className="font-bold text-foreground">
                {pagination.totalItems}
              </span>{" "}
              results
            </p>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 rounded-lg border-border"
                disabled={pagination.currentPage === 1}
                onClick={() =>
                  pagination.onPageChange(pagination.currentPage - 1)
                }
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => {
                  const page = i + 1;
                  const isActive = pagination.currentPage === page;

                  if (
                    totalPages <= 5 ||
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - pagination.currentPage) <= 1
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => pagination.onPageChange(page)}
                        className={`h-8 w-8 rounded-lg text-xs font-bold transition-all duration-200 ${
                          isActive
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent hover:border-border"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  }

                  if (
                    (page === 2 && pagination.currentPage > 3) ||
                    (page === totalPages - 1 &&
                      pagination.currentPage < totalPages - 2)
                  ) {
                    return (
                      <span
                        key={page}
                        className="text-muted-foreground text-xs px-1 font-bold"
                      >
                        ...
                      </span>
                    );
                  }

                  return null;
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 rounded-lg border-border"
                disabled={pagination.currentPage === totalPages}
                onClick={() =>
                  pagination.onPageChange(pagination.currentPage + 1)
                }
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
    </div>
  );
}
