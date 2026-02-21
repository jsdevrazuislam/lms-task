"use client";

import {
  Play,
  Zap,
  ShoppingCart,
  Clock,
  BookOpen,
  Globe,
  Award,
  MessageSquare,
  BarChart2,
} from "lucide-react";
import Image from "next/image";

import { ICourse } from "@/features/course/types";
import { useEnrollment } from "@/features/enrollment/hooks/useEnrollment";
import { useEnrollmentStatus } from "@/features/enrollment/hooks/useEnrollmentStatus";

interface CourseSidebarProps {
  course: ICourse;
  totalLessons: number;
}

export const CourseSidebar = ({ course, totalLessons }: CourseSidebarProps) => {
  const { enroll, isEnrolling } = useEnrollment(course.id);
  const { data: enrollmentStatus, isLoading: isLoadingStatus } =
    useEnrollmentStatus(course.id);

  const isAlreadyEnrolled = enrollmentStatus?.data?.isEnrolled;
  const discount =
    course.originalPrice && course.price
      ? Math.round(
          ((course.originalPrice - course.price) / course.originalPrice) * 100,
        )
      : 0;

  return (
    <div className="w-full lg:w-[340px] shrink-0">
      <div className="lg:sticky lg:top-24">
        <div className="rounded-2xl border border-border bg-card shadow-lg-theme overflow-hidden">
          {/* Video preview thumb */}
          <div
            className={`h-48 bg-linear-to-br ${course.gradient || "from-primary/20 to-primary/40"} relative flex items-center justify-center`}
          >
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors group">
              <Play className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />
            </div>
            <div className="absolute bottom-3 left-3 right-3 text-center">
              <span className="text-white/80 text-xs font-medium">
                Preview this course
              </span>
            </div>
          </div>

          <div className="p-5">
            {/* Price */}
            <div className="flex items-center gap-3 mb-1">
              <span className="text-3xl font-extrabold text-foreground">
                ${course.price}
              </span>
              {course.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  ${course.originalPrice}
                </span>
              )}
              {discount > 0 && (
                <span className="badge-destructive">{discount}% off</span>
              )}
            </div>
            <p className="text-xs text-destructive font-semibold mb-5">
              <Zap className="w-3.5 h-3.5 inline mr-1" />
              Limited time offer!
            </p>

            {/* CTA Buttons */}
            <div className="space-y-3 mb-6">
              <button
                onClick={enroll}
                disabled={isEnrolling || isAlreadyEnrolled || isLoadingStatus}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-linear-to-r from-primary to-primary/90 text-white font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all disabled:opacity-70 disabled:grayscale disabled:active:scale-100"
              >
                <ShoppingCart className="w-4 h-4" />
                {isAlreadyEnrolled
                  ? "Already Enrolled"
                  : isEnrolling
                    ? "Enrolling..."
                    : "Enroll Now"}
              </button>
            </div>

            {/* Course includes */}
            <div className="border-t border-border pt-5">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                This course includes
              </p>
              <div className="space-y-3">
                {[
                  {
                    icon: Clock,
                    text: `${course.duration} of on-demand video`,
                  },
                  { icon: BookOpen, text: `${totalLessons} lessons` },
                  {
                    icon: Zap,
                    text: `${course.curriculum?.length || 0} modules`,
                  },
                  { icon: Globe, text: "Full lifetime access" },
                  { icon: Award, text: "Certificate of completion" },
                  { icon: MessageSquare, text: "Q&A community access" },
                  { icon: BarChart2, text: "Progress tracking" },
                ].map(({ icon: Icon, text }) => (
                  <div
                    key={text}
                    className="flex items-center gap-2.5 text-sm text-muted-foreground"
                  >
                    <Icon className="w-4 h-4 shrink-0 text-primary" />
                    {text}
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-5 text-center text-xs text-muted-foreground">
              30-Day Money-Back Guarantee
            </p>
          </div>
        </div>

        {/* Mini instructor card */}
        {course.instructor && (
          <div className="mt-4 p-4 rounded-2xl border border-border bg-card">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
              Instructor
            </p>
            <div className="space-y-4">
              {(() => {
                const instructorName =
                  typeof course.instructor === "string"
                    ? course.instructor
                    : course.instructor?.firstName &&
                        course.instructor?.lastName
                      ? `${course.instructor.firstName} ${course.instructor.lastName}`
                      : "Unknown Instructor";
                return (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-bold shrink-0 relative overflow-hidden">
                        {course.instructor?.avatar ? (
                          <Image
                            src={course.instructor.avatar}
                            alt={instructorName}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          instructorName.charAt(0)
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">
                          {instructorName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {typeof course.instructor !== "string" &&
                          course.instructor?.title
                            ? course.instructor.title
                            : "Instructor"}
                        </p>
                      </div>
                    </div>
                    <button className="w-full py-2 text-xs font-bold text-primary border border-primary/20 rounded-xl hover:bg-primary/5 transition-colors">
                      View Profile
                    </button>
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
