"use client";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  TrendingUp,
  Star,
  Play,
  ArrowRight,
  Zap,
  Award,
  Activity,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatCardSkeleton, Skeleton } from "@/components/shared/SkeletonLoader";
import { useRecommendedCourses } from "@/features/course/hooks/useRecommendedCourses";
import { ICourse } from "@/features/course/types";
import { IEnrollment } from "@/features/enrollment/enrollment.api";
import { useEnrollmentStats } from "@/features/enrollment/hooks/useEnrollmentStats";
import { useStudentEnrollments } from "@/features/enrollment/hooks/useStudentEnrollments";
import { useAppSelector } from "@/store";

/* ── tiny helpers ── */
const ProgressBar = ({
  value,
  className = "",
}: {
  value: number;
  className?: string;
}) => (
  <div
    className={`h-2 w-full rounded-full bg-secondary overflow-hidden ${className}`}
  >
    <div
      className="h-full rounded-full bg-primary transition-all duration-700"
      style={{ width: `${value}%` }}
    />
  </div>
);

function timeAgo(iso: string) {
  if (!iso || iso === "N/A") return "N/A";
  const diff = Date.now() - new Date(iso).getTime();
  const d = Math.floor(diff / 86400000);
  if (d === 0) return "Today";
  if (d === 1) return "Yesterday";
  return `${d} days ago`;
}

export default function StudentDashboard() {
  const { user } = useAppSelector((state) => state.auth);
  const { data: statsData, isLoading: isStatsLoading } = useEnrollmentStats();
  const { data: enrollmentsData, isLoading: isEnrollmentsLoading } =
    useStudentEnrollments();
  const { data: recommendedCoursesData, isLoading: isRecommendedLoading } =
    useRecommendedCourses();

  const stats = statsData?.data;
  const enrollments = (enrollmentsData?.data || []) as IEnrollment[];
  const recommendedCourses = (recommendedCoursesData?.data || []) as ICourse[];

  const loading =
    isStatsLoading || isEnrollmentsLoading || isRecommendedLoading;

  const overallProgress = stats?.overallProgress || 0;
  const completed = enrollments.filter(
    (e: IEnrollment) => e.status === "COMPLETED",
  );

  const continueLearning = stats?.enrollmentDetails?.find(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (e: any) => e.status === "ACTIVE",
  );

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <>
      {/* ── Welcome Hero ── */}
      <div className="relative mb-6 overflow-hidden rounded-3xl bg-linear-to-br from-primary via-primary/90 to-purple-600 p-8 text-primary-foreground animate-slide-up">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/20 -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/10 translate-y-1/2 -translate-x-1/4" />
        </div>
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <p className="text-primary-foreground/70 text-sm font-medium">
              {greeting} 👋
            </p>
            <h2 className="text-3xl font-extrabold mt-1">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-primary-foreground/80 mt-2 text-sm max-w-md">
              {overallProgress >= 80
                ? "You're crushing it! Almost at the finish line. 🚀"
                : overallProgress >= 50
                  ? "Great momentum! Keep the streak going. 💪"
                  : "Every lesson gets you closer to your goal. Let's go! ⚡"}
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur rounded-full px-3 py-1.5 text-sm">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{overallProgress}% overall completion</span>
              </div>
            </div>
          </div>
          {continueLearning && (
            <Link
              href={`/dashboard/student/courses/${continueLearning.courseId}`}
              className="shrink-0 bg-white text-primary font-bold px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-white/90 transition-all duration-200 shadow-elevated text-sm"
            >
              <Play className="w-4 h-4 fill-current" />
              Continue Learning
            </Link>
          )}
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              title="Enrolled"
              value={stats?.totalEnrolled || 0}
              icon={<BookOpen className="w-5 h-5" />}
              color="bg-primary text-primary-foreground"
            />
            <StatCard
              title="Completed"
              value={stats?.completedCourses || 0}
              icon={<CheckCircle2 className="w-5 h-5 text-white" />}
              color="bg-emerald-500"
            />
            <StatCard
              title="Active"
              value={stats?.activeCourses || 0}
              icon={<Clock className="w-5 h-5 text-white" />}
              color="bg-amber-500"
            />
            <StatCard
              title="Overall %"
              value={`${overallProgress}%`}
              icon={<TrendingUp className="w-5 h-5 text-white" />}
              color="bg-violet-500"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* ── Continue Learning ── */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-foreground">
              Continue Learning
            </h3>
          </div>

          {loading ? (
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-card">
              <Skeleton className="h-44 w-full" />
              <div className="p-5 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-9 w-32" />
              </div>
            </div>
          ) : continueLearning ? (
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 group">
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={continueLearning.thumbnail || "/placeholder-course.png"}
                  alt={continueLearning.courseTitle}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4">
                  <span className="inline-flex items-center gap-1 bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-full">
                    <Clock className="w-3 h-3" />
                    Progress: {continueLearning.progress}%
                  </span>
                </div>
              </div>
              <div className="p-5">
                <p className="text-xs text-muted-foreground font-medium mb-1">
                  {continueLearning.instructor}
                </p>
                <h4 className="font-bold text-foreground text-lg leading-tight mb-1">
                  {continueLearning.courseTitle}
                </h4>
                <div className="flex items-center gap-3 mb-4 mt-2">
                  <ProgressBar
                    value={continueLearning.progress}
                    className="flex-1"
                  />
                  <span className="text-sm font-bold text-primary shrink-0">
                    {continueLearning.progress}%
                  </span>
                </div>
                <Link
                  href={`/dashboard/student/courses/${continueLearning.courseId}`}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-primary/90 transition-colors"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Resume Course
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-2xl p-10 text-center shadow-card">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="font-semibold text-foreground">No active courses</p>
              <Link
                href="/courses"
                className="mt-3 inline-flex items-center gap-1.5 text-primary text-sm font-medium hover:underline"
              >
                Explore courses <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {/* All active courses mini list */}
          {!loading && enrollments.length > 1 && (
            <div className="space-y-3">
              {enrollments
                .filter((e) => e.courseId !== continueLearning?.courseId)
                .slice(0, 3)
                .map((e) => (
                  <Link
                    key={e.id}
                    href={`/dashboard/student/courses/${e.courseId}`}
                    className="flex items-center gap-4 bg-card border border-border rounded-xl p-3 hover:shadow-card-hover transition-all duration-200 group"
                  >
                    <div className="relative w-14 h-10 overflow-hidden rounded-lg shrink-0">
                      <Image
                        src={e.course.thumbnail || "/placeholder-course.png"}
                        alt={e.course.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {e.course.title}
                      </p>
                      <ProgressBar
                        value={
                          stats?.enrollmentDetails?.find(
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            (d: any) => d.courseId === e.courseId,
                          )?.progress || 0
                        }
                        className="mt-1.5"
                      />
                    </div>
                    <span className="text-sm font-bold text-primary shrink-0">
                      {stats?.enrollmentDetails?.find(
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (d: any) => d.courseId === e.courseId,
                      )?.progress || 0}
                      %
                    </span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  </Link>
                ))}
            </div>
          )}
        </div>

        {/* ── Right Column ── */}
        <div className="space-y-6">
          {/* Recent Activity (Placeholder for real data later) */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-foreground">
                Recent Activity
              </h3>
            </div>
            <div className="bg-card border border-border rounded-2xl divide-y divide-border shadow-card">
              {enrollments.slice(0, 3).map((e) => (
                <div key={e.id} className="flex items-start gap-3 p-4">
                  <span className="text-lg shrink-0 mt-0.5">📖</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground leading-snug">
                      Continuous learning
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {e.course.title} · {timeAgo(e.enrolledAt)}
                    </p>
                  </div>
                </div>
              ))}
              {enrollments.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-6">
                  No recent activity
                </p>
              )}
            </div>
          </div>

          {/* Achievements */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-foreground">
                Achievements
              </h3>
            </div>
            <div className="bg-card border border-border rounded-2xl p-4 shadow-card space-y-3">
              {completed.map((c) => (
                <div key={c.id} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0">
                    <Award className="w-4 h-4 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {c.course.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Completed · {timeAgo(c.enrolledAt)}
                    </p>
                  </div>
                </div>
              ))}
              {completed.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-2">
                  Complete a course to earn achievements!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Recommended Courses ── */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-foreground">
              Recommended for You
            </h3>
          </div>
          <Link
            href="/courses"
            className="text-sm text-primary font-semibold hover:underline flex items-center gap-1"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {recommendedCourses.slice(0, 5).map((c: ICourse) => (
            <div
              key={c.id}
              className="bg-card border border-border rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 group cursor-pointer flex flex-col"
            >
              <Link
                href={`/courses/${c.id}`}
                className="block relative h-28 overflow-hidden"
              >
                <Image
                  src={c.thumbnail || "/placeholder-course.png"}
                  alt={c.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
                <span className="absolute top-2 left-2 text-[10px] bg-primary text-primary-foreground font-bold px-2 py-0.5 rounded-full">
                  {c.category?.name}
                </span>
              </Link>
              <div className="p-3 flex-1 flex flex-col justify-between">
                <h4 className="text-sm font-bold text-foreground leading-snug line-clamp-2 mb-1">
                  {c.title}
                </h4>
                <p className="text-[10px] text-muted-foreground mb-2">
                  {c.instructor?.firstName} {c.instructor?.lastName}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="text-xs font-bold">4.8</span>
                  </div>
                  <span className="text-sm font-extrabold text-primary">
                    ${c.price}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {recommendedCourses.length === 0 && !loading && (
            <div className="col-span-full py-10 text-center text-muted-foreground italic">
              Enrolling in more courses helps us improve your recommendations!
            </div>
          )}
        </div>
      </div>
    </>
  );
}
