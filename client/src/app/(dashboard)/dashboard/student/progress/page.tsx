"use client";
import { format } from "date-fns";
import {
  TrendingUp,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Play,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useEnrollmentStats } from "@/features/enrollment/hooks/useEnrollmentStats";
import { EnrollmentDetails } from "@/features/enrollment/progress.api";

function timeAgo(iso: string) {
  if (!iso || iso === "N/A") return "N/A";
  const diff = Date.now() - new Date(iso).getTime();
  const d = Math.floor(diff / 86400000);
  if (d === 0) return "Today";
  if (d === 1) return "Yesterday";
  return `${d} days ago`;
}

const ProgressBar = ({ value }: { value: number }) => (
  <div className="h-2.5 w-full rounded-full bg-secondary overflow-hidden">
    <div
      className="h-full rounded-full bg-primary transition-all duration-700"
      style={{ width: `${value}%` }}
    />
  </div>
);

export default function StudentProgress() {
  const { data: statsData, isLoading } = useEnrollmentStats();
  const stats = statsData?.data;
  const enrollments = (stats?.enrollmentDetails || []) as EnrollmentDetails[];
  const [selected, setSelected] = useState<string | null>(null);

  const totalEnrolled = stats?.totalEnrolled || 0;
  const totalCompleted = stats?.completedCourses || 0;
  const overallCompletion = stats?.overallProgress || 0;
  const selectedEnrollment = enrollments.find((e) => e.courseId === selected);
  const completedLessons = selectedEnrollment?.completedLessons || 0;
  const totalLessons = selectedEnrollment?.totalLessons || 0;
  const remainingLessons = totalLessons - completedLessons;
  const estTimeLeft = "—"; // Could be derived if duration exists

  return (
    <>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Total Enrolled"
          value={totalEnrolled}
          icon={<BookOpen className="w-5 h-5" />}
          color="bg-primary text-primary-foreground"
          loading={isLoading}
        />
        <StatCard
          title="Completed"
          value={totalCompleted}
          icon={<CheckCircle2 className="w-5 h-5 text-white" />}
          color="bg-emerald-500"
          loading={isLoading}
        />
        <StatCard
          title="Avg Completion"
          value={`${overallCompletion}%`}
          icon={<TrendingUp className="w-5 h-5 text-white" />}
          color="bg-violet-500"
          loading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Progress Table */}
        <div className="xl:col-span-3 bg-card border border-border rounded-2xl shadow-card overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="text-base font-bold text-foreground">
              Course Progress
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Course
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Progress
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Last Active
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? [1, 2, 3].map((i) => (
                      <tr key={i} className="border-b border-border">
                        <td className="px-6 py-4">
                          <Skeleton className="h-6 w-32" />
                        </td>
                        <td className="px-4 py-4">
                          <Skeleton className="h-4 w-24" />
                        </td>
                        <td className="px-4 py-4">
                          <Skeleton className="h-4 w-16" />
                        </td>
                        <td className="px-4 py-4">
                          <Skeleton className="h-4 w-20" />
                        </td>
                        <td className="px-4 py-4">
                          <Skeleton className="h-4 w-4" />
                        </td>
                      </tr>
                    ))
                  : enrollments.map((e) => (
                      <tr
                        key={e.courseId}
                        className={`border-b border-border cursor-pointer transition-colors ${
                          selected === e.courseId
                            ? "bg-primary/5"
                            : "hover:bg-muted/30"
                        }`}
                        onClick={() =>
                          setSelected(
                            selected === e.courseId ? null : e.courseId,
                          )
                        }
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-7 overflow-hidden rounded-lg shrink-0">
                              <Image
                                src={e.thumbnail || "/placeholder-course.jpg"}
                                alt=""
                                fill
                                className="object-cover"
                              />
                            </div>
                            <span className="font-semibold text-foreground line-clamp-1 text-xs">
                              {e.title}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2 min-w-24">
                            <ProgressBar value={e.progress} />
                            <span className="text-xs font-bold text-primary shrink-0">
                              {e.progress}%
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full capitalize ${e.progress === 100 ? "bg-emerald-100 text-emerald-700" : "bg-primary/10 text-primary"}`}
                          >
                            {e.progress === 100 ? "Completed" : "Active"}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-xs text-muted-foreground">
                          {e.lastActive ? timeAgo(e.lastActive) : "—"}
                        </td>
                        <td className="px-4 py-4">
                          <ChevronRight
                            className={`w-4 h-4 text-muted-foreground transition-transform ${selected === e.courseId ? "rotate-90" : ""}`}
                          />
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Panel */}
        <div className="xl:col-span-2">
          {selectedEnrollment ? (
            <div className="bg-card border border-border rounded-2xl shadow-card overflow-hidden">
              <div className="relative h-32">
                <Image
                  src={
                    selectedEnrollment.thumbnail || "/placeholder-course.jpg"
                  }
                  alt={selectedEnrollment.courseTitle}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4">
                  <h3 className="text-white font-bold text-sm leading-snug line-clamp-2">
                    {selectedEnrollment.courseTitle}
                  </h3>
                </div>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-extrabold text-primary">
                    {selectedEnrollment.progress}%
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${selectedEnrollment.progress === 100 ? "bg-emerald-100 text-emerald-700" : "bg-primary/10 text-primary"}`}
                  >
                    {selectedEnrollment.progress === 100
                      ? "Completed"
                      : "Active"}
                  </span>
                </div>
                <ProgressBar value={selectedEnrollment.progress} />

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-muted/50 rounded-xl p-3 text-center">
                    <p className="text-lg font-extrabold text-foreground">
                      {completedLessons}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Completed
                    </p>
                  </div>
                  <div className="bg-muted/50 rounded-xl p-3 text-center">
                    <p className="text-lg font-extrabold text-foreground">
                      {remainingLessons}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Remaining
                    </p>
                  </div>
                  <div className="bg-muted/50 rounded-xl p-3 text-center">
                    <p className="text-lg font-extrabold text-foreground">
                      {estTimeLeft}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">Left</p>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground space-y-1">
                  <div className="flex justify-between">
                    <span>Enrolled</span>
                    <span className="font-medium text-foreground">
                      {selectedEnrollment.enrolledAt
                        ? format(
                            new Date(selectedEnrollment.enrolledAt),
                            "MMM d, yyyy",
                          )
                        : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Active</span>
                    <span className="font-medium text-foreground">
                      {selectedEnrollment.lastActive
                        ? timeAgo(selectedEnrollment.lastActive)
                        : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Instructor</span>
                    <span className="font-medium text-foreground">
                      {selectedEnrollment.instructor}
                    </span>
                  </div>
                </div>

                {selectedEnrollment.status !== "dropped" && (
                  <Link
                    href={`/dashboard/student/courses/${selectedEnrollment.courseId}`}
                    className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-4 py-2.5 rounded-xl text-sm hover:bg-primary/90 transition-colors"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    Continue Learning
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-2xl shadow-card p-10 text-center flex flex-col items-center justify-center min-h-64">
              <TrendingUp className="w-12 h-12 text-muted-foreground/30 mb-3" />
              <p className="font-semibold text-foreground">Select a course</p>
              <p className="text-sm text-muted-foreground mt-1">
                Click a row to see detailed progress
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
