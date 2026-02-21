"use client";

import { CheckCircle, Circle, Play, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SecureVideoPlayer } from "@/components/video/SecureVideoPlayer";
import { ILesson } from "@/features/course/types";

interface LessonContentProps {
  courseId: string;
  lesson: ILesson;
  isCompleted: boolean;
  onToggleComplete: () => void;
  isUpdating: boolean;
}

export function LessonContent({
  courseId,
  lesson,
  isCompleted,
  onToggleComplete,
  isUpdating,
}: LessonContentProps) {
  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 lg:p-10">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Content Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/50">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest">
                {lesson.contentType === "video" ? (
                  <Play className="w-3 h-3" />
                ) : (
                  <FileText className="w-3 h-3" />
                )}
                {lesson.contentType} Lesson
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                {lesson.title}
              </h1>
            </div>
            <Button
              onClick={onToggleComplete}
              disabled={isUpdating}
              variant={isCompleted ? "outline" : "default"}
              className="rounded-xl h-12 px-6 font-bold transition-all shadow-sm shrink-0"
            >
              {isCompleted ? (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" /> Completed
                </>
              ) : (
                <>
                  <Circle className="w-5 h-5 mr-2" /> Mark as Complete
                </>
              )}
            </Button>
          </div>

          {/* Media Body */}
          <div className="space-y-6">
            {lesson.contentType === "video" && lesson.videoUrl ? (
              <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl-theme bg-black ring-1 ring-border">
                <SecureVideoPlayer courseId={courseId} lessonId={lesson.id} />
              </div>
            ) : lesson.contentType === "text" ? (
              <div className="prose prose-slate dark:prose-invert max-w-none bg-card/30 p-8 rounded-2xl border border-border/50 shadow-sm">
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      lesson.content || "No content available for this lesson.",
                  }}
                />
              </div>
            ) : (
              <div className="p-12 text-center rounded-2xl border-2 border-dashed border-border bg-muted/5">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-bold">Supplemental Materials</h3>
                <p className="text-muted-foreground mt-2">
                  This lesson contains downloadable resources.
                </p>
                <Button className="mt-6 gap-2 rounded-xl">
                  <Download className="w-4 h-4" /> Download Resources
                </Button>
              </div>
            )}
          </div>

          {/* Footer Insight */}
          <div className="pt-10 border-t border-border/50">
            <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10 flex items-start gap-4">
              <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                <Play className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Learning Tip</h4>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  Take notes as you watch this lesson. Revisiting your notes
                  within 24 hours can increase retention by up to 80%.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
