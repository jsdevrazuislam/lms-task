import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { pricingPlans } from "@/constants/landing";

export const Pricing = () => {
  return (
    <section className="py-24 bg-muted/30" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="badge-primary inline-block mb-4">Pricing</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-muted-foreground">
            Start free, scale when you&apos;re ready.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`relative p-8 rounded-2xl border transition-all duration-300 flex flex-col ${
                plan.highlighted
                  ? "border-primary bg-linear-to-b from-primary/10 to-card shadow-primary"
                  : "border-border bg-card hover:border-primary/30 hover:"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="badge-primary px-4 py-1.5 text-xs font-bold shadow-primary">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-bold text-foreground mb-1">
                  {plan.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {plan.description}
                </p>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-extrabold text-foreground">
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground text-sm mb-1">
                    /{plan.period}
                  </span>
                </div>
              </div>

              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2.5 text-sm text-foreground"
                  >
                    <CheckCircle className="w-4 h-4 text-success shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/register"
                className={`w-full text-center py-3 rounded-xl font-semibold text-sm transition-all ${
                  plan.highlighted
                    ? "bg-gradient-primary text-white hover:opacity-90 shadow-primary"
                    : "border border-border bg-background hover:bg-muted text-foreground"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
