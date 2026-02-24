"use client";

import { useRouter } from "@bprogress/next";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo } from "react";

import CourseFormClient from "@/components/instructor/course-builder/CourseFormClient";
import { courseService } from "@/features/course/services/course.service";
import { CourseFormValues } from "@/features/course/types/course-form";

export default function EditCourseClient() {
  const { id } = useParams();
  const router = useRouter();

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["courses", id],
    queryFn: () => courseService.getCourse(id as string),
    enabled: !!id,
  });

  const initialData = useMemo<CourseFormValues | undefined>(() => {
    if (!response?.data) return undefined;

    const course = response.data;

    return {
      title: course.title,
      subtitle: course.subtitle || "",
      categoryId: course.categoryId,
      price: course.price,
      originalPrice: course.originalPrice || 0,
      duration: course.duration,
      level: course.level,
      isFree: course.price === 0, // Simplified or check specific isFree field if added to Course model
      description: course.description,
      thumbnail: course.thumbnail || "",
      promoVideoUrl: course.promoVideoUrl || "",
      whatYouLearn: course.whatYouLearn?.join("\n") || "",
      requirements: course.requirements?.join("\n") || "",
      tags: course.tags?.join(", ") || "",
      metaDescription: course.metaDescription || "",
      modules: (course.modules || []).map((m) => ({
        id: m.id,
        title: m.title,
        lessons: (m.lessons || []).map((l) => ({
          id: l.id,
          title: l.title,
          contentType: (l.contentType as "video" | "text") || "video",
          isPreview: l.isFree || false,
          content: l.content || "",
          videoUrl: l.videoUrl || "",
        })),
      })),
    };
  }, [response]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground font-medium">
          Loading course data...
        </p>
      </div>
    );
  }

  if (error || !response?.data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h2 className="text-2xl font-bold">Course Not Found</h2>
        <p className="text-muted-foreground">
          The course you are looking for does not exist or you don&apos;t have
          permission.
        </p>
        <button
          onClick={() => router.push("/dashboard/instructor/courses")}
          className="px-4 py-2 bg-primary text-white rounded-lg"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  return <CourseFormClient courseId={id as string} initialData={initialData} />;
}
