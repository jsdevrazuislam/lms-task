"use client";

import {
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  PlayCircle,
  FileText,
} from "lucide-react";
import { useState } from "react";
import { ICourse } from "@/features/course/types";
import { cn } from "@/lib/utils";

interface CourseSidebarProps {
  course: ICourse;
  activeLessonId: string;
  onLessonSelect: (lessonId: string) => void;
  completedLessonIds: string[];
}

export function CourseSidebar({
  course,
  activeLessonId,
  onLessonSelect,
  completedLessonIds,
}: CourseSidebarProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set([course.modules?.[0]?.title || ""]),
  );

  const toggleModule = (moduleTitle: string) => {
    const next = new Set(expandedModules);
    if (next.has(moduleTitle)) {
      next.delete(moduleTitle);
    } else {
      next.add(moduleTitle);
    }
    setExpandedModules(next);
  };

  return (
    <aside className="w-full lg:w-80 h-full border-r border-border bg-card/50 flex flex-col shrink-0">
      <div className="p-6 border-b border-border bg-muted/20">
        <h2 className="text-lg font-bold truncate" title={course.title}>
          {course.title}
        </h2>
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{
                width: `${(completedLessonIds.length / (course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 1)) * 100}%`,
              }}
            />
          </div>
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            {Math.round(
              (completedLessonIds.length /
                (course.modules?.reduce(
                  (acc, m) => acc + (m.lessons?.length || 0),
                  0,
                ) || 1)) *
                100,
            )}
            %
          </span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-2">
        {course.modules?.map((module, mIdx) => {
          const isOpen = expandedModules.has(module.title);
          const completedInModule =
            module.lessons?.filter((l) => completedLessonIds.includes(l.id))
              .length || 0;

          return (
            <div
              key={module.id || module.title}
              className="rounded-xl border border-border/50 bg-background/40 overflow-hidden"
            >
              <button
                onClick={() => toggleModule(module.title)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors text-left"
              >
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">
                    Section {mIdx + 1}
                  </span>
                  <span className="text-sm font-bold">{module.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                    {completedInModule}/{module.lessons?.length || 0}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </button>

              {isOpen && (
                <div className="p-1 space-y-1">
                  {module.lessons?.map((lesson) => {
                    const isActive = activeLessonId === lesson.id;
                    const isCompleted = completedLessonIds.includes(lesson.id);

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => onLessonSelect(lesson.id)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group text-left",
                          isActive
                            ? "bg-primary/20 text-primary shadow-sm"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        )}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 shrink-0 group-hover:text-primary transition-colors" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{lesson.title}</p>
                          <div className="flex items-center gap-2 mt-0.5 opacity-60">
                            {lesson.contentType === "video" ? (
                              <PlayCircle className="w-3 h-3" />
                            ) : (
                              <FileText className="w-3 h-3" />
                            )}
                            <span className="text-[10px] uppercase font-bold tracking-tighter">
                              {lesson.contentType}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
