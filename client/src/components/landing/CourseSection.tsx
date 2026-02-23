import { ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import { CourseCard } from "@/components/courses/CourseCard";
import { courseService } from "@/features/course/services/course.service";
import { ICourse } from "@/features/course/types";

export async function CourseSection() {
  let popularCourses: ICourse[] = [];
  let isError = false;

  try {
    const popularData = await courseService.getPopularCourses();
    popularCourses = popularData?.data || [];
  } catch (error) {
    console.error("Error fetching popular courses:", error);
    isError = true;
  }

  if (isError) {
    return (
      <div className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="p-8 rounded-2xl border border-destructive/20 bg-destructive-muted/10">
            <h3 className="text-xl font-bold text-foreground mb-2">
              Oops! Something went wrong
            </h3>
            <p className="text-muted-foreground mb-6">
              We couldn&apos;t load the popular courses at this time.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-48 -mt-48" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
              <Star className="w-3 h-3 fill-primary" />
              Most Popular Courses
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground leading-tight">
              Expand your career opportunities with{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-primary-hover">
                LearnFlow
              </span>
            </h2>
          </div>
          <Link
            href="/courses"
            className="group flex items-center gap-2 text-primary font-bold hover:text-primary-hover transition-colors"
          >
            Explore all courses
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {popularCourses.length === 0 ? (
          <div className="py-12 px-4 rounded-3xl border border-dashed border-border bg-muted/20 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Star className="w-8 h-8 text-muted-foreground/30" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              No popular courses yet
            </h3>
            <p className="text-muted-foreground max-w-md">
              We&apos;re currently updating our catalog with top-rated learning
              content. Check back soon for our most popular picks!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularCourses.map((course: ICourse, index: number) => (
              <CourseCard
                key={course.id}
                course={course}
                priority={index < 2} // Priority for top 2 visible cards
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
