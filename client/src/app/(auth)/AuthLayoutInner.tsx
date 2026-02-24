import { BookOpen } from "lucide-react";
import Link from "next/link";

interface AuthLayoutInnerProps {
  children: React.ReactNode;
  sidePanel: React.ReactNode;
}

export function AuthLayoutInner({ children, sidePanel }: AuthLayoutInnerProps) {
  return (
    <div className="min-h-screen flex">
      {sidePanel}

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-background overflow-y-auto">
        <div className="w-full max-w-md animate-scale-in">
          {/* Mobile logo */}
          <Link
            href="/"
            className="flex items-center gap-3 mb-10 lg:hidden cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold">LearnFlow</span>
          </Link>

          {children}
        </div>
      </div>
    </div>
  );
}
