"use client";

import { format } from "date-fns";
import {
  Award,
  Download,
  BookOpen,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useCertificates } from "@/features/enrollment/hooks/useCertificates";

function simulatePdfDownload(courseTitle: string, date: string) {
  const content = `
LearnFlow Learning Platform
============================

CERTIFICATE OF COMPLETION

This is to certify that

Alex Johnson

has successfully completed the course:

"${courseTitle}"

Date of Completion: ${date}

Congratulations on this outstanding achievement!

LearnFlow Learning Platform
  `.trim();

  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Certificate_${courseTitle.replace(/\s+/g, "_")}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function StudentCertificates() {
  const { data: certsData, isLoading } = useCertificates();
  const certificates = certsData?.data || [];
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = (
    courseId: string,
    courseTitle: string,
    date: string,
  ) => {
    setDownloading(courseId);
    setTimeout(() => {
      simulatePdfDownload(courseTitle, date);
      setDownloading(null);
    }, 800);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-card border border-border rounded-3xl overflow-hidden shadow-card"
          >
            <Skeleton className="h-52 w-full rounded-none" />
            <div className="p-5 space-y-3">
              <Skeleton className="h-5 w-full" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
              </div>
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {certificates.length === 0 ? (
        <div className="bg-card border border-border rounded-3xl p-20 text-center shadow-card">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Award className="w-10 h-10 text-muted-foreground/40" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">
            No certificates yet
          </h3>
          <p className="text-muted-foreground">
            Complete a course to earn your first certificate!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {certificates.map((e) => (
            <div
              key={e.id}
              className="group bg-card border border-border rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"
            >
              {/* Certificate visual */}
              <div className="relative h-52 bg-linear-to-br from-primary via-primary/80 to-purple-600 flex flex-col items-center justify-center p-6 overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 left-0 w-40 h-40 rounded-full border-4 border-white -translate-x-1/2 -translate-y-1/2" />
                  <div className="absolute bottom-0 right-0 w-56 h-56 rounded-full border-4 border-white translate-x-1/3 translate-y-1/3" />
                  <div className="absolute top-1/2 left-1/2 w-24 h-24 rounded-full border-2 border-white -translate-x-1/2 -translate-y-1/2" />
                </div>

                {/* Seal */}
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center mb-3 border-2 border-white/30">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1">
                    Certificate of Completion
                  </p>
                  <p className="text-white font-bold text-sm">LearnFlow</p>
                </div>

                {/* Ribbon */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-amber-400 via-orange-400 to-amber-400" />
              </div>

              {/* Card body */}
              <div className="p-5">
                <h3 className="font-bold text-foreground leading-snug mb-3 line-clamp-2 text-sm">
                  {e.course.title}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>
                      {e.course.instructor?.firstName}{" "}
                      {e.course.instructor?.lastName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      Completed on{" "}
                      {format(new Date(e.updatedAt), "MMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-emerald-600 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>100% Complete</span>
                  </div>
                </div>

                <button
                  onClick={() =>
                    handleDownload(
                      e.courseId,
                      e.course.title,
                      format(new Date(e.updatedAt), "MMM d, yyyy"),
                    )
                  }
                  disabled={downloading === e.courseId}
                  className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-4 py-2.5 rounded-xl text-sm hover:bg-primary/90 transition-all duration-200 disabled:opacity-70"
                >
                  {downloading === e.courseId ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Preparing...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Download Certificate
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary banner */}
      {certificates.length > 0 && (
        <div className="bg-linear-to-r mt-6 from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0 shadow-elevated">
            <Award className="w-7 h-7 text-white" />
          </div>
          <div>
            <h4 className="font-extrabold text-foreground">
              Outstanding Achievement!
            </h4>
            <p className="text-sm text-muted-foreground mt-0.5">
              You&apos;ve completed{" "}
              <span className="font-bold text-foreground">
                {certificates.length} course
                {certificates.length !== 1 ? "s" : ""}
              </span>{" "}
              on LearnFlow. Keep learning to unlock more certificates!
            </p>
          </div>
        </div>
      )}
    </>
  );
}
