import { Metadata } from "next";
import { notFound } from "next/navigation";
import ErrorBoundary from "@/components/shared/ErrorBoundary";
import { courseService } from "@/features/course/services/course.service";
import { CourseDetailClient } from "./CourseDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

/**
 * Generates dynamic SEO metadata based on the course details.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const response = await courseService.getCourse(id);
    const course = response.data;

    const title = `${course.title} | Learning Management System`;
    const description =
      course.metaDescription ||
      course.subtitle ||
      course.description?.substring(0, 160) ||
      "Explore this course on our LMS platform.";

    return {
      title,
      description,
      openGraph: {
        title: course.title,
        description,
        images: course.thumbnail ? [course.thumbnail] : [],
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: course.title,
        description,
        images: course.thumbnail ? [course.thumbnail] : [],
      },
    };
  } catch (error) {
    console.error("Metadata generation error:", error);
    return {
      title: "Course Details | LMS",
    };
  }
}

/**
 * Course Detail Page (Server Component)
 * Handles data pre-fetching for SEO and passes it to the client component.
 */
export default async function CourseDetailPage({ params }: Props) {
  const { id } = await params;

  let initialData = null;
  try {
    const response = await courseService.getCourse(id);
    initialData = response?.data;
  } catch (error) {
    console.error("Course fetch error:", error);
    // We let the client component handle the actual error state for better UX
  }

  if (!initialData && !id) {
    return notFound();
  }

  return (
    <ErrorBoundary>
      <CourseDetailClient id={id} initialData={initialData} />
    </ErrorBoundary>
  );
}
