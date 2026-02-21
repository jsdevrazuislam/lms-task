import { BookOpen } from "lucide-react";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-foreground text-lg tracking-tight">
                LearnFlow
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              The modern LMS for teams and individuals who want to grow without
              limits.
            </p>
          </div>
          {[
            {
              title: "Product",
              links: ["Courses", "Pricing", "Enterprise", "Changelog"],
            },
            { title: "Company", links: ["About", "Blog", "Careers", "Press"] },
            {
              title: "Legal",
              links: ["Privacy", "Terms", "Cookies", "Security"],
            },
          ].map(({ title, links }) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-foreground mb-4">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((l) => (
                  <li key={l}>
                    <Link
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <span>© 2026 LearnFlow Inc. All rights reserved.</span>
          <span>Made with ❤️ for lifelong learners</span>
        </div>
      </div>
    </footer>
  );
};
