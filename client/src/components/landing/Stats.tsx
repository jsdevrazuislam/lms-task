import { stats } from "@/constants/landing";

export const Stats = () => {
  return (
    <section className="border-y border-border bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map(({ value, label, icon: Icon }) => (
            <div key={label} className="text-center">
              <div className="inline-flex w-12 h-12 rounded-xl bg-primary/10 items-center justify-center mb-3">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div className="text-3xl lg:text-4xl font-extrabold gradient-text mb-1">
                {value}
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
