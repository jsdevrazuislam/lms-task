import { BookOpen } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LearnFlowLogoProps {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  href?: string;
}

export const LearnFlowLogo = ({
  className,
  iconClassName,
  textClassName,
  href = "/",
}: LearnFlowLogoProps) => {
  return (
    <Link
      href={href}
      className={cn("flex items-center gap-2.5 group", className)}
    >
      <div
        className={cn(
          "w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-primary/20 shadow-lg",
          iconClassName,
        )}
      >
        <BookOpen className="w-4 h-4 text-white" />
      </div>
      <span
        className={cn(
          "font-bold text-foreground text-lg tracking-tight group-hover:text-primary transition-colors",
          textClassName,
        )}
      >
        LearnFlow
      </span>
    </Link>
  );
};
