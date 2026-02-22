"use client";

import { ArrowLeft, BookOpen, CheckCircle, Star, Users } from "lucide-react";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CourseCurriculum } from "@/components/courses/CourseCurriculum";
import { CourseDetailHero } from "@/components/courses/CourseDetailHero";
import { CourseDetailSkeleton } from "@/components/courses/CourseDetailSkeleton";
import { CourseSidebar } from "@/components/courses/CourseSidebar";
import { Button } from "@/components/ui/button";
import { useCourse } from "@/features/course/hooks/useCourses";
import { ICourse, ICurriculumSection } from "@/features/course/types";

interface CourseDetailClientProps {
  id: string;
  initialData?: ICourse;
}

export function CourseDetailClient({
  id,
  initialData,
}: CourseDetailClientProps) {
  const { data: response, isLoading, error, refetch } = useCourse(id);

  // Use initialData as fallback during hydration or if query hasn't finished
  const course = response?.data || initialData;

  if (isLoading && !initialData) return <CourseDetailSkeleton />;

  if (error && !initialData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <AlertCircle className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-xl font-bold mb-2">Error Loading Course</h2>
        <p className="text-muted-foreground mb-6">
          {error instanceof Error
            ? error.message
            : "Failed to fetch course details. Please try again."}
        </p>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    );
  }

  if (!course) notFound();

  const totalLessons =
    course.curriculum?.reduce(
      (sum: number, s: ICurriculumSection) => sum + (s.lessons || 0),
      0,
    ) ||
    course.lessons ||
    0;

  return (
    <div className="min-h-screen bg-background">
      {/* Top breadcrumb bar */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center gap-2 text-sm text-muted-foreground">
          <Link
            href="/courses"
            className="flex items-center gap-1.5 hover:text-foreground transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Courses
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium truncate">
            {course.category?.name || "Course Details"}
          </span>
        </div>
      </div>

      <CourseDetailHero course={course} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Course Content */}
          <div className="flex-1 min-w-0 space-y-8">
            {/* What you'll learn */}
            {course.whatYouLearn && course.whatYouLearn.length > 0 && (
              <div className="p-6 rounded-2xl border border-border bg-card">
                <h2 className="text-xl font-bold text-foreground mb-5">
                  What you&apos;ll learn
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {course.whatYouLearn.map((item: string) => (
                    <div
                      key={item}
                      className="flex items-start gap-2.5 text-sm text-foreground"
                    >
                      <CheckCircle className="w-4 h-4 text-success mt-0.5 shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Requirements */}
            {course.requirements && course.requirements.length > 0 && (
              <div className="p-6 rounded-2xl border border-border bg-card">
                <h2 className="text-xl font-bold text-foreground mb-4">
                  Requirements
                </h2>
                <ul className="space-y-2">
                  {course.requirements.map((r: string) => (
                    <li
                      key={r}
                      className="flex items-start gap-2.5 text-sm text-muted-foreground"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Curriculum */}
            {course.curriculum && (
              <CourseCurriculum
                curriculum={course.curriculum}
                totalLessons={totalLessons}
                totalDuration={course.duration || "0 hours"}
              />
            )}

            {/* Instructor */}
            {course.instructor && (
              <div className="p-6 rounded-2xl border border-border bg-card">
                <h2 className="text-xl font-bold text-foreground mb-5">
                  Your Instructor
                </h2>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center text-white text-xl font-bold shrink-0">
                    {course.instructor.avatar || course.instructor.firstName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-foreground text-lg">
                      {course.instructor.firstName} {course.instructor.lastName}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {course.instructor.title || "Senior Instructor"}
                    </p>
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-warning fill-warning" />
                        {course.instructor.rating || 0} Rating
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {(
                          course.instructor.students || 0
                        ).toLocaleString()}{" "}
                        Students
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" />
                        {course.instructor.courses || 0} Courses
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {course.instructor.bio}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <CourseSidebar course={course} totalLessons={totalLessons} />
        </div>
      </div>
    </div>
  );
}
