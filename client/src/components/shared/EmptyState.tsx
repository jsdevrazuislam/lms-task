import { LucideIcon } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-20 px-6 text-center animate-fade-in",
        className,
      )}
    >
      <div className="w-16 h-16 rounded-3xl bg-muted/50 flex items-center justify-center mb-6 ring-8 ring-muted/20">
        <Icon className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-[280px] mx-auto mb-8">
        {description}
      </p>
      {action && (
        <Button
          onClick={action.onClick}
          className="rounded-xl px-6 font-semibold"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
