import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  size?: "xs" | "sm" | "md" | "lg";
  showNumber?: boolean;
}

export const StarRating = ({
  rating,
  size = "sm",
  showNumber = false,
}: StarRatingProps) => {
  const iconSizes = {
    xs: "w-3 h-3",
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const textSizes = {
    xs: "text-[10px]",
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div className="flex items-center gap-1.5">
      {showNumber && (
        <span className={`font-bold text-warning ${textSizes[size]}`}>
          {rating?.toFixed(1)}
        </span>
      )}
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`${iconSizes[size]} ${
              i < Math.round(rating)
                ? "text-warning fill-warning"
                : "text-muted-foreground"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
