import { Draggable } from "@hello-pangea/dnd";
import {
  GripVertical,
  FileText,
  Play,
  ChevronUp,
  ChevronDown,
  Trash2,
  Upload,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ListTree,
  Video,
} from "lucide-react";
import React, { useEffect } from "react";
import { useFormContext, useWatch, useFormState } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { CourseFormValues } from "@/features/course/types/course-form";
import { useCurriculum } from "./CurriculumContext";

interface CurriculumLessonProps {
  lesson: CourseFormValues["modules"][number]["lessons"][number];
  mIdx: number;
  lIdx: number;
  removeLesson: (index: number) => void;
}

export const CurriculumLesson: React.FC<CurriculumLessonProps> = ({
  lesson,
  mIdx,
  lIdx,
  removeLesson,
}) => {
  const { register, control, setValue, trigger } =
    useFormContext<CourseFormValues>();

  const { errors } = useFormState({
    control,
  });

  const {
    expandedLessons,
    toggleLessonExpansion,
    lessonUploads,
    uploadLessonVideo,
  } = useCurriculum();

  const isExpanded = !!expandedLessons[lesson.id];
  const uploadStatus = lessonUploads[lesson.id] || {
    isUploading: false,
    progress: 0,
  };
  const { isUploading, progress: uploadProgress } = uploadStatus;

  // useWatch isolates re-renders to only this component when these specific fields change
  const contentType = useWatch({
    control,
    name: `modules.${mIdx}.lessons.${lIdx}.contentType`,
  });
  const isPreview = useWatch({
    control,
    name: `modules.${mIdx}.lessons.${lIdx}.isPreview`,
  });
  const videoUrl = useWatch({
    control,
    name: `modules.${mIdx}.lessons.${lIdx}.videoUrl`,
  });
  const content = useWatch({
    control,
    name: `modules.${mIdx}.lessons.${lIdx}.content`,
  });

  useEffect(() => {
    // Explicitly trigger validation when content or videoUrl changes to ensure real-time error clearing
    // This is especially important for custom Zod refinements that might not be re-checked automatically
    if (content || videoUrl) {
      trigger(`modules.${mIdx}.lessons.${lIdx}.content`);
      trigger(`modules.${mIdx}.lessons.${lIdx}.videoUrl`);
    }
  }, [content, videoUrl, trigger, mIdx, lIdx]);

  return (
    <Draggable draggableId={lesson.id} index={lIdx}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`bg-card rounded-xl border group overflow-hidden transition-all duration-200 ${
            errors.modules?.[mIdx]?.lessons?.[lIdx]
              ? "border-destructive ring-1 ring-destructive/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
              : "hover:border-primary/30"
          }`}
        >
          {errors.modules?.[mIdx]?.lessons?.[lIdx] && (
            <div className="bg-destructive text-white text-[10px] font-bold px-3 py-1 flex items-center gap-2">
              <AlertCircle className="w-3 h-3" />
              Lesson has validation errors
            </div>
          )}
          <div className="flex items-center gap-3 p-3">
            <div {...provided.dragHandleProps}>
              <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="shrink-0 w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground">
              {lIdx + 1}
            </div>
            <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <div className="flex-1">
                <Input
                  className="h-8 border-none bg-transparent focus-visible:ring-0 px-0 font-medium"
                  placeholder="Lesson Title"
                  {...register(`modules.${mIdx}.lessons.${lIdx}.title`)}
                />
                {errors.modules?.[mIdx]?.lessons?.[lIdx] && (
                  <div className="flex flex-col gap-1 mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                    {errors.modules?.[mIdx]?.lessons?.[lIdx]?.title && (
                      <p className="text-[10px] text-destructive font-bold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.modules[mIdx]?.lessons?.[lIdx]?.title?.message}
                      </p>
                    )}
                    {errors.modules?.[mIdx]?.lessons?.[lIdx]?.content && (
                      <p className="text-[10px] text-destructive font-bold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {
                          errors.modules[mIdx]?.lessons?.[lIdx]?.content
                            ?.message
                        }
                      </p>
                    )}
                    {errors.modules?.[mIdx]?.lessons?.[lIdx]?.videoUrl && (
                      <p className="text-[10px] text-destructive font-bold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {
                          errors.modules[mIdx]?.lessons?.[lIdx]?.videoUrl
                            ?.message
                        }
                      </p>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3 ml-auto">
                <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
                  {contentType === "text" ? (
                    <FileText className="w-3 h-3" />
                  ) : (
                    <Play className="w-3 h-3" />
                  )}
                  <FormField
                    control={control}
                    name={`modules.${mIdx}.lessons.${lIdx}.contentType`}
                    render={({ field }) => (
                      <FormItem className="space-y-0!">
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-transparent border-none focus:ring-0 h-auto p-0 capitalize font-medium">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="video">Video</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/30 border border-transparent hover:border-border transition-colors">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">
                    Preview
                  </span>
                  <Switch
                    className="scale-75"
                    checked={isPreview}
                    onCheckedChange={(val) =>
                      setValue(
                        `modules.${mIdx}.lessons.${lIdx}.isPreview`,
                        val,
                        { shouldValidate: true, shouldDirty: true },
                      )
                    }
                  />
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => toggleLessonExpansion(lesson.id)}
                >
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeLesson(lIdx)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>

          {isExpanded && (
            <div className="px-5 pb-5 pt-2 border-t bg-muted/5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
              {contentType === "text" ? (
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Lesson Content (Markdown Supported)
                  </Label>
                  <Textarea
                    className="min-h-[200px] bg-card resize-y text-sm leading-relaxed"
                    placeholder="Write your lesson content here..."
                    {...register(`modules.${mIdx}.lessons.${lIdx}.content`)}
                  />
                  {errors.modules?.[mIdx]?.lessons?.[lIdx]?.content && (
                    <p className="text-xs text-destructive font-bold block mt-1">
                      {errors.modules[mIdx]?.lessons?.[lIdx]?.content?.message}
                    </p>
                  )}
                  <p className="text-[10px] text-muted-foreground text-right italic">
                    {content?.length || 0} characters
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Lesson Video
                    </Label>

                    {!videoUrl && !isUploading && (
                      <div
                        className="relative group cursor-pointer"
                        onClick={() =>
                          document
                            .getElementById(`video-upload-${lesson.id}`)
                            ?.click()
                        }
                      >
                        <div className="border-2 border-dashed border-primary/20 rounded-2xl p-10 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 transition-all duration-300 flex flex-col items-center justify-center text-center gap-4">
                          <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                            <Upload className="w-8 h-8 text-primary" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-bold text-foreground">
                              Upload Lesson Video
                            </p>
                            <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
                              Drag and drop your video file here, or click to
                              browse.
                            </p>
                          </div>
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground bg-white px-2.5 py-1 rounded-full shadow-xs border">
                              <Video className="w-3 h-3" /> MP4, MOV
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground bg-white px-2.5 py-1 rounded-full shadow-xs border">
                              <ListTree className="w-3 h-3" /> MAX 100MB
                            </div>
                          </div>
                        </div>
                        <input
                          id={`video-upload-${lesson.id}`}
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file)
                              uploadLessonVideo(mIdx, lIdx, lesson.id, file);
                          }}
                        />
                      </div>
                    )}

                    {isUploading && (
                      <div className="p-6 bg-card border rounded-2xl shadow-sm space-y-4 animate-in fade-in zoom-in-95 duration-300">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <Loader2 className="w-5 h-5 text-primary animate-spin" />
                            </div>
                            <div>
                              <p className="text-sm font-bold">
                                Uploading video...
                              </p>
                              <p className="text-[10px] text-muted-foreground">
                                Securing your content for the cloud
                              </p>
                            </div>
                          </div>
                          <span className="text-lg font-black text-primary">
                            {uploadProgress}%
                          </span>
                        </div>

                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all duration-500 ease-out shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {videoUrl && (
                      <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex items-center justify-between gap-4 group">
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-200 shrink-0">
                              <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-emerald-900 truncate">
                                Video Uploaded Successfully
                              </p>
                              <p className="text-[10px] text-emerald-600/80 font-medium">
                                Your lesson is ready for secure streaming
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-9 px-4 rounded-xl text-xs font-bold border-emerald-200 bg-white hover:bg-emerald-50 transition-colors"
                              onClick={() =>
                                document
                                  .getElementById(`video-upload-${lesson.id}`)
                                  ?.click()
                              }
                            >
                              Change
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 text-destructive hover:bg-destructive/5 rounded-full"
                              onClick={() =>
                                setValue(
                                  `modules.${mIdx}.lessons.${lIdx}.videoUrl`,
                                  "",
                                  { shouldValidate: true, shouldDirty: true },
                                )
                              }
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {errors.modules?.[mIdx]?.lessons?.[lIdx]?.videoUrl && (
                      <p className="text-sm text-destructive font-bold flex items-center gap-2 mt-2 p-2 bg-destructive/5 rounded-lg border border-destructive/20">
                        <AlertCircle className="w-4 h-4" />
                        {
                          errors.modules[mIdx]?.lessons?.[lIdx]?.videoUrl
                            ?.message
                        }
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};
