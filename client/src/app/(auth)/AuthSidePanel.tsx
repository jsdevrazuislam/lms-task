import { BookOpen } from "lucide-react";
import Image from "next/image";

interface AuthSidePanelProps {
  title: string | React.ReactNode;
  subtitle: string;
  features?: string[];
  image?: string;
  icon?: React.ReactNode;
}

export function AuthSidePanel({
  title,
  subtitle,
  features,
  image = "/assets/auth-bg.jpeg",
  icon,
}: AuthSidePanelProps) {
  return (
    <div
      className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 text-white overflow-hidden"
      style={{ background: "var(--gradient-hero)" }}
    >
      <Image
        width={500}
        height={500}
        src={image}
        alt="Auth Bg"
        loading="eager"
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      />
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-16">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-primary">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">LearnFlow</span>
        </div>

        <div className="max-w-md animate-fade-in">
          {icon && (
            <div className="w-20 h-20 rounded-3xl bg-primary/30 flex items-center justify-center mb-6 backdrop-blur">
              {icon}
            </div>
          )}
          <h1 className="text-4xl font-bold leading-tight mb-6">{title}</h1>
          <p className="text-white/70 text-lg leading-relaxed mb-10">
            {subtitle}
          </p>

          {features && (
            <div className="space-y-4">
              {features.map((f) => (
                <div key={f} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-secondary/30 flex items-center justify-center shrink-0">
                    <span className="text-secondary text-xs">✓</span>
                  </div>
                  <span className="text-white/80 text-sm">{f}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
