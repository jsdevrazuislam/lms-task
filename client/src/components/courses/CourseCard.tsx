import { BookOpen, Users, Clock } from "lucide-react";
import Link from "next/link";

import { StarRating } from "@/components/shared/StarRating";
import { CustomImage } from "@/components/ui/CustomImage";
import { ICourse } from "@/features/course/types";

interface CourseCardProps {
  course: ICourse;
  variant?: "grid" | "list";
  priority?: boolean;
}

export const CourseCard = ({
  course,
  variant = "grid",
  priority = false,
}: CourseCardProps) => {
  const isList = variant === "list";

  // Support both ID and _id depending on API response
  const courseId = course.id;
  const thumbnail = course.thumbnail;
  const instructorName = course.instructor
    ? `${course.instructor.firstName} ${course.instructor.lastName}`
    : "Unknown Instructor";

  return (
    <Link
      href={`/courses/${courseId}`}
      className={`group block overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg-theme ${
        isList ? "flex flex-col sm:flex-row" : "flex flex-col"
      }`}
    >
      <div
        className={`relative flex items-center justify-center bg-linear-to-br overflow-hidden rounded-t-2xl aspect-video ${
          course.gradient || "from-primary/10 to-primary/5"
        } ${isList ? "w-full sm:w-64" : "w-full"}`}
      >
        <CustomImage
          src={thumbnail || "/placeholder-course.png"}
          alt={course.title}
          fill
          priority={priority}
          containerClassName="absolute inset-0"
          className="transition-transform duration-500 group-hover:scale-110"
          sizes={
            isList
              ? "(max-width: 640px) 100vw, 256px"
              : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 350px"
          }
          fallbackIcon={<BookOpen className="h-10 w-10 text-primary/40" />}
        />

        {course.tag && (
          <span
            className={`absolute top-3 left-3 z-10 ${course.tagColor || "badge-primary"}`}
          >
            {course.tag}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex-1">
          <h3 className="mb-1 capitalize line-clamp-2 text-sm font-bold leading-snug text-foreground transition-colors group-hover:text-primary sm:text-base">
            {course.title}
          </h3>
          <p className="mb-3 text-xs text-muted-foreground">{instructorName}</p>

          <div className="mb-4">
            <StarRating rating={course.rating} showNumber />
            {course?.reviews !== undefined && (
              <span className="ml-1 text-[10px] text-muted-foreground">
                ({course.reviews.toLocaleString()} reviews)
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-base font-bold text-foreground">
            {course.price === 0 ? "Free" : `$${course.price}`}
          </span>
          {course.originalPrice && course.originalPrice > course.price && (
            <span className="text-xs text-muted-foreground line-through decoration-muted-foreground/50">
              ${course.originalPrice}
            </span>
          )}
        </div>

        {/* Meta */}
        <div className="flex items-center gap-4 border-t border-border pt-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5" title="Students">
            <Users className="h-3.5 w-3.5" />
            {course.students || 0}
          </span>
          <span className="flex items-center gap-1.5" title="Duration">
            <Clock className="h-3.5 w-3.5" />
            {course.duration || "Self-paced"}
          </span>
          <span className="flex items-center gap-1.5" title="Lessons">
            <BookOpen className="h-3.5 w-3.5" />
            {course.lessons || 0} lessons
          </span>
        </div>
      </div>
    </Link>
  );
};
