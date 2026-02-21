"use client";

import { AlertCircle, ArrowLeft, Menu, X } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useOptimistic, useTransition, useMemo } from "react";
import { CourseSidebar } from "@/components/student/CourseSidebar";
import { LessonContent } from "@/components/student/LessonContent";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCourse } from "@/features/course/hooks/useCourses";
import { ILesson, IModule } from "@/features/course/types";
import {
  useLessonProgress,
  useToggleLessonCompletion,
} from "@/features/enrollment/hooks/useLessonProgress";

export default function CoursePlayerPage() {
  const params = useParams();
  const courseId = params.id as string;

  // UI State
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Data Fetching
  const {
    data: course,
    isLoading: courseLoading,
    error: courseError,
  } = useCourse(courseId);
  const { data: progress, isLoading: progressLoading } =
    useLessonProgress(courseId);
  const { mutateAsync: toggleCompletion } = useToggleLessonCompletion(courseId);

  // Optimistic Progress tracking (React 19)
  const [optimisticCompletedIds, addOptimisticCompletedId] = useOptimistic(
    progress?.data?.completedLessonIds || [],
    (state: string[], lessonId: string) => {
      if (state.includes(lessonId)) {
        return state.filter((id) => id !== lessonId);
      }
      return [...state, lessonId];
    },
  );

  // Derived State
  const allLessons = useMemo(
    () => course?.data?.modules?.flatMap((m: IModule) => m.lessons) || [],
    [course],
  );
  const currentLesson = useMemo(() => {
    if (activeLessonId) {
      return allLessons.find((l: ILesson) => l.id === activeLessonId);
    }
    return allLessons[0];
  }, [activeLessonId, allLessons]);

  // Handlers
  const handleToggleComplete = async () => {
    if (!currentLesson) return;

    const lessonId = currentLesson.id || currentLesson.title;

    startTransition(async () => {
      addOptimisticCompletedId(lessonId);
      try {
        await toggleCompletion(lessonId);
      } catch {
        // Error handled by mutation hook toast
      }
    });
  };

  if (courseLoading || progressLoading) {
    return (
      <div className="flex h-screen bg-background">
        <Skeleton className="hidden lg:block w-80 h-full border-r" />
        <div className="flex-1 p-10 space-y-4">
          <Skeleton className="h-12 w-1/3" />
          <Skeleton className="aspect-video w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (courseError || !course?.data) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4 p-4 text-center">
        <AlertCircle className="w-16 h-16 text-destructive opacity-50" />
        <h2 className="text-2xl font-extrabold">Course not found</h2>
        <p className="text-muted-foreground max-w-md">
          We couldn&apos;t find the course you&apos;re looking for. It might
          have been removed or you don&apos;t have access.
        </p>
        <Button asChild className="rounded-xl px-8">
          <Link href="/dashboard/student/courses">Back to My Courses</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
      {/* Mobile Header */}
      <header className="lg:hidden absolute top-0 left-0 right-0 h-16 border-b border-border bg-background/80 backdrop-blur-md z-40 px-4 flex items-center justify-between">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/student/courses">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <span className="font-bold truncate px-4">{course.data.title}</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </Button>
      </header>

      {/* Sidebar - Desktop & Mobile Drawer */}
      <div
        className={`
                fixed inset-0 z-50 lg:relative lg:z-0 lg:block
                ${sidebarOpen ? "block" : "hidden"}
            `}
      >
        <div
          className="absolute inset-0 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="relative h-full w-80 max-w-[85vw] bg-background">
          <CourseSidebar
            course={course.data}
            activeLessonId={currentLesson?.id || ""}
            onLessonSelect={(id) => {
              setActiveLessonId(id);
              setSidebarOpen(false);
            }}
            completedLessonIds={optimisticCompletedIds}
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col pt-16 lg:pt-0 overflow-hidden">
        {currentLesson ? (
          <LessonContent
            courseId={courseId}
            lesson={currentLesson}
            isCompleted={optimisticCompletedIds.includes(
              currentLesson.id || currentLesson.title,
            )}
            onToggleComplete={handleToggleComplete}
            isUpdating={isPending}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center p-10 text-center">
            <div className="max-w-sm space-y-4">
              <h3 className="text-xl font-bold">Select a lesson to begin</h3>
              <p className="text-muted-foreground">
                Pick a section from the curriculum and start your learning
                journey.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
