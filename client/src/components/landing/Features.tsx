import { features } from "@/constants/landing";

export const Features = () => {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="badge-primary inline-block mb-4">
            Platform Features
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight mb-4">
            Everything you need to{" "}
            <span className="gradient-text">level up</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            A full-featured learning platform built for individuals, teams, and
            enterprises.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, description, color, bg }) => (
            <div
              key={title}
              className="group p-6 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all duration-300 hover: cursor-default"
            >
              <div
                className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
