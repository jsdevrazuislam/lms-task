"use client";

import axios from "axios";
import type { AxiosProgressEvent } from "axios";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";

import { useFormContext } from "react-hook-form";
import { toast } from "sonner";

import { courseService } from "@/features/course/services/course.service";
import { CourseFormValues } from "@/features/course/types/course-form";

export interface UploadState {
  isUploading: boolean;
  progress: number;
}

interface CurriculumContextType {
  // Isolated UI states
  expandedLessons: Record<string, boolean>;
  toggleLessonExpansion: (lessonId: string) => void;

  // Upload states
  lessonUploads: Record<string, UploadState>;
  thumbnailUpload: UploadState;

  // Handlers
  uploadLessonVideo: (
    moduleId: number,
    lessonId: number,
    lessonUuid: string,
    file: File,
  ) => Promise<void>;
  uploadThumbnail: (file: File) => Promise<void>;
  removeThumbnail: () => void;
}

const CurriculumContext = createContext<CurriculumContextType | undefined>(
  undefined,
);

export const CurriculumProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { setValue } = useFormContext<CourseFormValues>();

  const [expandedLessons, setExpandedLessons] = useState<
    Record<string, boolean>
  >({});
  const [lessonUploads, setLessonUploads] = useState<
    Record<string, UploadState>
  >({});
  const [thumbnailUpload, setThumbnailUpload] = useState<UploadState>({
    isUploading: false,
    progress: 0,
  });

  const toggleLessonExpansion = useCallback((lessonId: string) => {
    setExpandedLessons((prev) => ({
      ...prev,
      [lessonId]: !prev[lessonId],
    }));
  }, []);

  const uploadLessonVideo = useCallback(
    async (
      moduleId: number,
      lessonId: number,
      lessonUuid: string,
      file: File,
    ) => {
      if (file.size > 100 * 1024 * 1024) {
        toast.error("Video file size must be less than 100MB");
        return;
      }

      try {
        setLessonUploads((prev) => ({
          ...prev,
          [lessonUuid]: { isUploading: true, progress: 0 },
        }));

        const { data: signData } = await courseService.getUploadSignature({
          folder: "lessons/videos",
          resource_type: "video",
        });

        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", signData.apiKey);
        formData.append("timestamp", signData.timestamp.toString());
        formData.append("signature", signData.signature);
        formData.append("folder", "lessons/videos");
        formData.append("resource_type", "video");

        if (signData.eager) {
          formData.append("eager", signData.eager);
          formData.append("eager_async", "true");
        }

        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${signData.cloudName}/video/upload`,
          formData,
          {
            onUploadProgress: (progressEvent: AxiosProgressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / (progressEvent.total || 1),
              );
              setLessonUploads((prev) => ({
                ...prev,
                [lessonUuid]: { isUploading: true, progress: percentCompleted },
              }));
            },
          },
        );

        if (response.data.secure_url) {
          setValue(
            `modules.${moduleId}.lessons.${lessonId}.videoUrl`,
            response.data.secure_url,
            {
              shouldValidate: true,
              shouldDirty: true,
              shouldTouch: true,
            },
          );
          toast.success("Video uploaded successfully!");
        }
      } catch (error: unknown) {
        console.error("Video upload failed:", error);
        const message =
          error instanceof Error ? error.message : "Video upload failed";
        toast.error(message);
      } finally {
        setLessonUploads((prev) => {
          const next = { ...prev };
          delete next[lessonUuid];
          return next;
        });
      }
    },
    [setValue],
  );

  const uploadThumbnail = useCallback(
    async (file: File) => {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }

      try {
        setThumbnailUpload({ isUploading: true, progress: 0 });

        const { data: signData } = await courseService.getUploadSignature();

        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", signData.apiKey);
        formData.append("timestamp", signData.timestamp.toString());
        formData.append("signature", signData.signature);
        formData.append("folder", "thumbnails");

        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`,
          formData,
          {
            onUploadProgress: (progressEvent: AxiosProgressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / (progressEvent.total || 1),
              );
              setThumbnailUpload({
                isUploading: true,
                progress: percentCompleted,
              });
            },
          },
        );

        if (response.data.secure_url) {
          setValue("thumbnail", response.data.secure_url, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
          });
          toast.success("Thumbnail uploaded successfully!");
        }
      } catch (error: unknown) {
        console.error("Upload Error:", error);
        let message = "Failed to upload thumbnail";
        if (axios.isAxiosError(error) && error.response?.data?.error?.message) {
          message = error.response.data.error.message;
        } else if (error instanceof Error) {
          message = error.message;
        }
        toast.error(message);
      } finally {
        setThumbnailUpload({ isUploading: false, progress: 0 });
      }
    },
    [setValue],
  );

  const removeThumbnail = useCallback(() => {
    setValue("thumbnail", "", {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    const input = document.getElementById(
      "thumbnail-input",
    ) as HTMLInputElement;
    if (input) input.value = "";
  }, [setValue]);

  const value = useMemo(
    () => ({
      expandedLessons,
      toggleLessonExpansion,
      lessonUploads,
      thumbnailUpload,
      uploadLessonVideo,
      uploadThumbnail,
      removeThumbnail,
    }),
    [
      expandedLessons,
      toggleLessonExpansion,
      lessonUploads,
      thumbnailUpload,
      uploadLessonVideo,
      uploadThumbnail,
      removeThumbnail,
    ],
  );

  return (
    <CurriculumContext.Provider value={value}>
      {children}
    </CurriculumContext.Provider>
  );
};

export const useCurriculum = () => {
  const context = useContext(CurriculumContext);
  if (context === undefined) {
    throw new Error("useCurriculum must be used within a CurriculumProvider");
  }
  return context;
};
