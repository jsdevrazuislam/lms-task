import { Upload, Trash2, Video } from "lucide-react";
import Image from "next/image";
import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CourseFormValues } from "@/features/course/types/course-form";

import { useCurriculum } from "./CurriculumContext";

export const CourseMediaStep: React.FC = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<CourseFormValues>();
  const {
    thumbnailUpload: uploadState,
    uploadThumbnail,
    removeThumbnail,
  } = useCurriculum();

  // useWatch ensures we react to form state changes instantly without re-rendering the whole form
  const thumbnail = useWatch({
    control,
    name: "thumbnail",
  });

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadThumbnail(file);
  };
  const { isUploading, progress: uploadProgress } = uploadState;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Step 2: Media & Assets
          </CardTitle>
          <CardDescription>
            Visuals are key to attracting students.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-4">
            <Label>Course Thumbnail</Label>
            <div
              onClick={() =>
                !thumbnail &&
                document.getElementById("thumbnail-input")?.click()
              }
              className={`relative border-2 border-dashed rounded-xl overflow-hidden transition-all duration-300 group ${
                thumbnail
                  ? "border-primary/20 bg-muted/10 h-64"
                  : "p-12 flex flex-col items-center justify-center bg-muted/30 hover:bg-muted/50 cursor-pointer h-64"
              }`}
            >
              {thumbnail ? (
                <div className="relative w-full h-full group">
                  <Image
                    src={thumbnail}
                    alt="Course thumbnail preview"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <Button
                      type="button"
                      variant="default"
                      size="sm"
                      className="rounded-full"
                      disabled={isUploading}
                      onClick={(e) => {
                        e.stopPropagation();
                        document.getElementById("thumbnail-input")?.click();
                      }}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Replace
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="rounded-full"
                      disabled={isUploading}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeThumbnail();
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              ) : isUploading ? (
                <div className="flex flex-col items-center justify-center w-full h-full p-12 bg-muted/20">
                  <div className="relative w-20 h-20 mb-4">
                    <svg className="w-full h-full -rotate-90">
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="transparent"
                        className="text-muted"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="transparent"
                        strokeDasharray={226}
                        strokeDashoffset={226 - (226 * uploadProgress) / 100}
                        className="text-primary transition-all duration-300"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                      {uploadProgress}%
                    </div>
                  </div>
                  <p className="text-sm font-medium animate-pulse">
                    Uploading to Cloudinary...
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-sm font-semibold">
                    Upload high-resolution thumbnail
                  </p>
                  <p className="text-xs text-muted-foreground mt-2 max-w-[200px] text-center">
                    Click or drag and drop (PNG, JPG or WebP, max 10MB)
                  </p>
                </div>
              )}

              <input
                id="thumbnail-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleThumbnailUpload}
              />
            </div>
            {errors.thumbnail && (
              <p className="text-xs text-destructive">
                {errors.thumbnail.message}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <Label htmlFor="promoVideoUrl">Promotional Video URL</Label>
            <div className="flex gap-2">
              <div className="shrink-0 w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <Video className="w-5 h-5 text-red-500" />
              </div>
              <Input
                id="promoVideoUrl"
                placeholder="YouTube or Vimeo URL"
                {...register("promoVideoUrl")}
              />
            </div>
            <p className="text-[10px] text-muted-foreground">
              This video will be shown on the course landing page for preview.
            </p>
            {errors.promoVideoUrl && (
              <p className="text-xs text-destructive">
                {errors.promoVideoUrl.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
