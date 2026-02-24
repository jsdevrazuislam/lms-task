"use client";

import { useRouter } from "@bprogress/next";
import { DropResult } from "@hello-pangea/dnd";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout, ListTree, Video, Settings2 } from "lucide-react";
import { useState } from "react";
import {
  useForm,
  FormProvider,
  SubmitHandler,
  useFieldArray,
} from "react-hook-form";
import { toast } from "sonner";

import { AddCourseFooter } from "@/components/instructor/course-builder/AddCourseFooter";
import { AddCourseHeader } from "@/components/instructor/course-builder/AddCourseHeader";
import { CourseBasicsStep } from "@/components/instructor/course-builder/CourseBasicsStep";
import { CourseCurriculumStep } from "@/components/instructor/course-builder/CourseCurriculumStep";
import { CourseMediaStep } from "@/components/instructor/course-builder/CourseMediaStep";
import { CourseSettingsStep } from "@/components/instructor/course-builder/CourseSettingsStep";
import { CurriculumProvider } from "@/components/instructor/course-builder/CurriculumContext";
import { useCategories } from "@/features/course/hooks/useCategories";
import { courseService } from "@/features/course/services/course.service";
import { CreateCoursePayload } from "@/features/course/types";
import {
  courseSchema,
  CourseFormValues,
} from "@/features/course/types/course-form";

const STEP_FIELDS: Record<number, (keyof CourseFormValues)[]> = {
  0: [
    "title",
    "subtitle",
    "categoryId",
    "price",
    "originalPrice",
    "duration",
    "level",
    "description",
  ],
  1: ["thumbnail", "promoVideoUrl"],
  2: ["modules"],
  3: ["tags", "metaDescription", "whatYouLearn", "requirements"],
};

const STEPS = [
  { id: "basic", title: "Basic Information", icon: Layout },
  { id: "media", title: "Media & Assets", icon: Video },
  { id: "curriculum", title: "Curriculum Builder", icon: ListTree },
  { id: "settings", title: "Settings & SEO", icon: Settings2 },
];

interface CourseFormClientProps {
  courseId?: string;
  initialData?: CourseFormValues;
}

export default function CourseFormClient({
  courseId,
  initialData,
}: CourseFormClientProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeStep, setActiveStep] = useState(0);
  const { data: categories, isLoading: loadingCategories } = useCategories();

  const isEditMode = !!courseId;

  const mutation = useMutation({
    mutationFn: (payload: CreateCoursePayload) =>
      isEditMode
        ? courseService.updateCourse(courseId, payload)
        : courseService.createCourse(payload),
    onSuccess: () => {
      toast.success(
        isEditMode
          ? "Course updated successfully"
          : "Your course has been successfully submitted. Our team will review it and publish it after approval.",
      );
      queryClient.invalidateQueries({ queryKey: ["instructor", "courses"] });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["courses", courseId] });
      router.push("/dashboard/instructor/courses");
    },
    onError: (error: Error) => {
      const message =
        error.message ||
        `Failed to ${isEditMode ? "update" : "publish"} course`;
      toast.error(message);
    },
  });

  const isSubmitting = mutation.isPending;

  const methods = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    mode: "onBlur",
    defaultValues: initialData || {
      title: "",
      subtitle: "",
      categoryId: "",
      price: 0,
      originalPrice: 0,
      duration: "",
      level: "BEGINNER",
      isFree: false,
      description: "",
      thumbnail: "",
      promoVideoUrl: "",
      whatYouLearn: "",
      requirements: "",
      tags: "",
      metaDescription: "",
      modules: [
        {
          id: crypto.randomUUID().substring(0, 8),
          title: "Introduction",
          lessons: [
            {
              id: crypto.randomUUID().substring(0, 8),
              title: "Welcome to the course",
              contentType: "text" as const,
              isPreview: true,
              content: "",
              videoUrl: "",
            },
          ],
        },
      ],
    },
  });

  const {
    fields: moduleFields,
    append: appendModule,
    remove: removeModule,
    move: moveModule,
  } = useFieldArray({
    control: methods.control,
    name: "modules",
  });

  const onFormSubmit: SubmitHandler<CourseFormValues> = (data) => {
    const payload: CreateCoursePayload = {
      title: data.title,
      subtitle: data.subtitle,
      description: data.description,
      thumbnail: data.thumbnail,
      price: data.price,
      originalPrice: data.originalPrice,
      duration: data.duration,
      level: data.level,
      isFree: data.isFree,
      categoryId: data.categoryId,
      tags:
        data.tags
          ?.split(",")
          .map((t) => t.trim())
          .filter(Boolean) || [],
      whatYouLearn:
        typeof data.whatYouLearn === "string"
          ? data.whatYouLearn
              .split("\n")
              .map((s) => s.trim())
              .filter(Boolean)
          : data.whatYouLearn,
      requirements:
        typeof data.requirements === "string"
          ? data.requirements
              .split("\n")
              .map((s) => s.trim())
              .filter(Boolean)
          : data.requirements,
      metaDescription: data.metaDescription,
      promoVideoUrl: data.promoVideoUrl,
      modules: data.modules.map((m, mIdx) => ({
        id: m.id,
        title: m.title,
        order: mIdx + 1,
        lessons: m.lessons.map((l, lIdx) => ({
          id: l.id,
          title: l.title,
          order: lIdx + 1,
          contentType: l.contentType,
          content: l.content,
          videoUrl: l.videoUrl,
          isPreview: l.isPreview,
        })),
      })),
    };

    mutation.mutate(payload);
  };

  const nextStep = async () => {
    const fields = STEP_FIELDS[activeStep];
    const isValid = await methods.trigger(fields);
    if (isValid) {
      setActiveStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    } else {
      toast.error("Please fix the errors before proceeding");
    }
  };

  const prevStep = () => setActiveStep((prev) => Math.max(prev - 1, 0));

  const onDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    if (type === "module") {
      moveModule(source.index, destination.index);
    } else {
      const modules = methods.getValues("modules");
      const sourceModuleIdx = modules.findIndex(
        (m) => `module-${m.id}` === source.droppableId,
      );
      const destModuleIdx = modules.findIndex(
        (m) => `module-${m.id}` === destination.droppableId,
      );

      if (sourceModuleIdx !== -1 && destModuleIdx !== -1) {
        const sourceLessons = [...modules[sourceModuleIdx].lessons];
        const destLessons =
          sourceModuleIdx === destModuleIdx
            ? sourceLessons
            : [...modules[destModuleIdx].lessons];

        const [movedLesson] = sourceLessons.splice(source.index, 1);
        destLessons.splice(destination.index, 0, movedLesson);

        if (sourceModuleIdx === destModuleIdx) {
          methods.setValue(
            `modules.${sourceModuleIdx}.lessons`,
            sourceLessons,
            { shouldDirty: true, shouldTouch: true },
          );
        } else {
          methods.setValue(
            `modules.${sourceModuleIdx}.lessons`,
            sourceLessons,
            { shouldDirty: true, shouldTouch: true },
          );
          methods.setValue(`modules.${destModuleIdx}.lessons`, destLessons, {
            shouldDirty: true,
            shouldTouch: true,
          });
        }
      }
    }
  };

  return (
    <div className="pb-20">
      <AddCourseHeader
        steps={STEPS}
        activeStep={activeStep}
        setActiveStep={setActiveStep}
      />

      <main className="max-w-5xl mx-auto lg:px-8 mt-10">
        <FormProvider {...methods}>
          <CurriculumProvider>
            <form
              onSubmit={methods.handleSubmit(onFormSubmit)}
              className="space-y-10"
            >
              {activeStep === 0 && (
                <CourseBasicsStep
                  categories={categories}
                  loadingCategories={loadingCategories}
                />
              )}

              {activeStep === 1 && <CourseMediaStep />}

              {activeStep === 2 && (
                <CourseCurriculumStep
                  modules={moduleFields}
                  onDragEnd={onDragEnd}
                  appendModule={appendModule}
                  removeModule={removeModule}
                />
              )}

              {activeStep === 3 && (
                <CourseSettingsStep isSubmitting={isSubmitting} />
              )}

              <AddCourseFooter
                activeStep={activeStep}
                totalSteps={STEPS.length}
                prevStep={prevStep}
                nextStep={nextStep}
                isEditMode={isEditMode}
                isSubmitting={isSubmitting}
              />
            </form>
          </CurriculumProvider>
        </FormProvider>
      </main>
    </div>
  );
}
