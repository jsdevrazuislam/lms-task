"use client";

import { PlayCircle, ChevronDown, ChevronUp, Play, Lock } from "lucide-react";
import { useState } from "react";
import { ICurriculumSection, ICurriculumItem } from "@/features/course/types";
import { PreviewModal } from "./PreviewModal";

interface CourseCurriculumProps {
  curriculum: ICurriculumSection[];
  totalLessons: number;
  totalDuration: string;
}

export const CourseCurriculum = ({
  curriculum,
  totalLessons,
  totalDuration,
}: CourseCurriculumProps) => {
  const [openSection, setOpenSection] = useState<number | null>(0);
  const [previewItem, setPreviewItem] = useState<ICurriculumItem | null>(null);

  return (
    <div className="p-6 rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-foreground">Course Curriculum</h2>
        <span className="text-sm text-muted-foreground">
          {curriculum.length} sections · {totalLessons} lessons ·{" "}
          {totalDuration}
        </span>
      </div>

      <div className="space-y-2">
        {curriculum.map((section, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-border overflow-hidden"
          >
            <button
              onClick={() => setOpenSection(openSection === idx ? null : idx)}
              className="w-full flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/60 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <PlayCircle className="w-4 h-4 text-primary shrink-0" />
                <span className="font-semibold text-foreground text-sm">
                  {section.title}
                </span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-muted-foreground hidden sm:block">
                  {section.lessons} lessons · {section.duration}
                </span>
                {openSection === idx ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            </button>

            {openSection === idx && (
              <div className="divide-y divide-border animate-fade-in">
                {section.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-4 py-3 hover:bg-muted/20 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {item.isFree ? (
                        <Play className="w-4 h-4 text-primary shrink-0" />
                      ) : (
                        <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
                      )}
                      <span
                        className={`text-sm ${
                          item.isFree
                            ? "text-primary font-medium"
                            : "text-foreground"
                        }`}
                      >
                        {item.title}
                      </span>
                      {item.isFree && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewItem(item);
                          }}
                          className="badge-success text-[10px] cursor-pointer hover:bg-success/20 transition-colors"
                        >
                          Preview
                        </button>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {item.duration}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <PreviewModal
        isOpen={!!previewItem}
        onClose={() => setPreviewItem(null)}
        title={previewItem?.title || ""}
        videoUrl={previewItem?.videoUrl}
      />
    </div>
  );
};
