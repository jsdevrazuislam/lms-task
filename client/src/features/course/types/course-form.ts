import * as z from "zod";

export const courseSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters"),
  subtitle: z.string().min(5, "Subtitle must be at least 5 characters"),
  categoryId: z.string().min(1, "Please select a category"),
  price: z.number().min(0, "Price cannot be negative"),
  originalPrice: z
    .number()
    .min(0, "Original price cannot be negative")
    .optional(),
  duration: z.string().min(1, "Duration is required"),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  isFree: z.boolean(),
  description: z
    .string()
    .min(50, "Full description must be at least 50 characters"),
  thumbnail: z.string().min(1, "Course thumbnail is required"),
  promoVideoUrl: z.string().url("Invalid video URL").or(z.literal("")),
  whatYouLearn: z
    .string()
    .min(10, "Please provide at least 10 characters of learning objectives"),
  requirements: z
    .string()
    .min(10, "Please provide at least 10 characters of requirements"),
  tags: z.string().optional(),
  metaDescription: z.string().optional(),
  modules: z
    .array(
      z.object({
        id: z.string(),
        title: z.string().min(1, "Module title is required"),
        lessons: z
          .array(
            z.object({
              id: z.string(),
              title: z.string().min(1, "Lesson title is required"),
              contentType: z.enum(["text", "video"]),
              isPreview: z.boolean(),
              content: z.string().optional(),
              videoUrl: z.string().optional(),
            }),
          )
          .min(1, "Each module must have at least one lesson"),
      }),
    )
    .min(1, "At least one module is required")
    .superRefine((modules, ctx) => {
      modules.forEach((module, mIdx) => {
        module.lessons.forEach((lesson, lIdx) => {
          if (
            lesson.contentType === "text" &&
            (!lesson.content || lesson.content.trim().length < 10)
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Text content must be at least 10 characters",
              path: ["modules", mIdx, "lessons", lIdx, "content"],
            });
          }
          if (lesson.contentType === "video" && !lesson.videoUrl) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Video upload is required for this lesson",
              path: ["modules", mIdx, "lessons", lIdx, "videoUrl"],
            });
          }
        });
      });
    }),
});

export type CourseFormValues = z.infer<typeof courseSchema>;
