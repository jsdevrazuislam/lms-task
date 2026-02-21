import { Search, Flame, Sparkles, TrendingUp } from "lucide-react";

interface CatalogHeroProps {
  search: string;
  onSearchChange: (value: string) => void;
}

const featuredBanners = [
  {
    icon: Flame,
    label: "Trending Now",
    color: "text-destructive",
    bg: "bg-destructive/10",
  },
  {
    icon: Sparkles,
    label: "AI-Recommended",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: TrendingUp,
    label: "Career Boost",
    color: "text-success",
    bg: "bg-success/10",
  },
];

export const CatalogHero = ({ search, onSearchChange }: CatalogHeroProps) => {
  return (
    <div className="bg-gradient-hero border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
        <div className="badge-primary inline-block mb-4 text-white/90! bg-white/10!">
          Explore 4,800+ Courses
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
          Find your next{" "}
          <span
            className="text-transparent bg-clip-text"
            style={{
              backgroundImage:
                "linear-gradient(135deg, hsl(239 84% 80%), hsl(263 70% 80%))",
            }}
          >
            skill to master
          </span>
        </h1>
        <p className="text-white/60 text-lg max-w-xl mx-auto mb-8">
          Expert-led courses in development, design, data, business, and more.
        </p>

        {/* Hero Search */}
        <div className="max-w-2xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            type="text"
            placeholder="Search for anything…"
            className="w-full pl-12 pr-4 py-4 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground text-base focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-lg-theme"
          />
        </div>

        {/* Quick filter banners */}
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          {featuredBanners.map(({ icon: Icon, label, color, bg }) => (
            <button
              key={label}
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${bg} text-white/80 text-sm font-medium border border-white/10 hover:bg-white/20 transition-colors`}
            >
              <Icon className={`w-4 h-4 ${color}`} />
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
