import { Star } from "lucide-react";
import { levels } from "@/constants/courses";

interface CourseFiltersProps {
  selectedLevel: string;
  setSelectedLevel: (value: string) => void;
  priceMax: number;
  setPriceMax: (value: number) => void;
  selectedRating: number | null;
  setSelectedRating: (value: number | null) => void;
  onClear: () => void;
}

export const CourseFilters = ({
  selectedLevel,
  setSelectedLevel,
  priceMax,
  setPriceMax,
  selectedRating,
  setSelectedRating,
  onClear,
}: CourseFiltersProps) => {
  return (
    <aside className="w-64 shrink-0 animate-fade-in-right">
      <div className="sticky top-24 space-y-6 p-5 rounded-2xl border border-border bg-card">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-foreground text-sm">Filters</h3>
          <button
            onClick={onClear}
            className="text-xs text-primary hover:underline font-medium"
          >
            Clear all
          </button>
        </div>

        {/* Level */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Level
          </h4>
          <div className="space-y-2">
            {levels.map((l) => (
              <label
                key={l}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <input
                  type="radio"
                  name="level"
                  value={l}
                  checked={selectedLevel === l}
                  onChange={() => setSelectedLevel(l)}
                  className="w-4 h-4 accent-primary border-border text-primary focus:ring-primary/20 cursor-pointer"
                />
                <span className="text-sm capitalize! text-foreground group-hover:text-primary transition-colors font-medium">
                  {l}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Price */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Max Price:{" "}
            <span className="text-foreground font-bold">${priceMax}</span>
          </h4>
          <input
            type="range"
            min={0}
            max={1000}
            step={10}
            value={priceMax}
            onChange={(e) => setPriceMax(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>$0</span>
            <span>$1000+</span>
          </div>
        </div>

        {/* Rating */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Rating
          </h4>
          <div className="space-y-2">
            {[4.5, 4.0, 3.5].map((r) => (
              <label
                key={r}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-primary rounded border-border text-primary focus:ring-primary/20 cursor-pointer"
                  checked={selectedRating === r}
                  onChange={() =>
                    setSelectedRating(selectedRating === r ? null : r)
                  }
                />
                <span className="text-sm text-foreground flex items-center gap-1 group-hover:text-primary transition-colors font-medium">
                  <Star className="w-3.5 h-3.5 text-warning fill-warning" /> {r}{" "}
                  & up
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};
