import { Sparkles, ChevronRight, ArrowRight, Play } from "lucide-react";
import Link from "next/link";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Background glow blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-20 right-0 w-80 h-80 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 w-96 h-64 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28 text-center">
        {/* Pill badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5" />
          Trusted by 120,000+ learners worldwide
          <ChevronRight className="w-3.5 h-3.5" />
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-foreground tracking-tight leading-[1.1] mb-6 animate-fade-in">
          Learn faster with <span className="gradient-text">AI-powered</span>
          <br className="hidden sm:block" /> education
        </h1>

        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground leading-relaxed mb-10 animate-fade-in">
          LearnFlow combines expert-led courses, AI personalization, and a
          vibrant community to help you master any skill — on your timeline, at
          your pace.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
          <Link
            href="/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-primary text-white font-bold text-base hover:opacity-90 transition-all shadow-primary hover:shadow-lg"
          >
            Start Learning Free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/courses"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-border bg-card text-foreground font-semibold text-base hover:bg-muted transition-all"
          >
            <Play className="w-4 h-4 text-primary" />
            Browse Courses
          </Link>
        </div>

        {/* Social proof */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          {[
            "No credit card required",
            "14-day free trial",
            "Cancel anytime",
          ].map((text) => (
            <span key={text} className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-success/20 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-success" />
              </span>
              {text}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
