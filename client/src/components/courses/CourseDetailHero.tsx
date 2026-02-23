import { Users, Clock, Globe, TrendingUp } from "lucide-react";

import { StarRating } from "@/components/shared/StarRating";
import { ICourse } from "@/features/course/types";

interface CourseDetailHeroProps {
  course: ICourse;
}

export const CourseDetailHero = ({ course }: CourseDetailHeroProps) => {
  return (
    <div className="bg-gradient-hero">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {course.tag && <span className="badge-warning">{course.tag}</span>}
            <span className="badge-primary">{course.level}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-4">
            {course.title}
          </h1>
          <p className="text-white/70 text-base capitalize leading-relaxed mb-6">
            {course.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-white/70 mb-4">
            <div className="flex items-center gap-1.5 font-bold text-warning">
              <StarRating rating={course.rating} size="sm" showNumber />
              {course.reviews && (
                <span className="text-white/50 font-normal">
                  ({course.reviews.toLocaleString()} ratings)
                </span>
              )}
            </div>
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              {course.students} students
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {course.duration} total
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-white/60">
            <span>
              Created by{" "}
              <span className="text-primary font-semibold">
                {course.instructor
                  ? `${course.instructor.firstName} ${course.instructor.lastName}`
                  : "Unknown Instructor"}
              </span>
            </span>
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" />
              {course.language || "English"}
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              Updated{" "}
              {new Date(
                course.updatedAt || course.createdAt,
              ).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
