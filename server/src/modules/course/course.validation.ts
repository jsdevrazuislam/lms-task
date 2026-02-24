import { CourseStatus } from '@prisma/client';
import { z } from 'zod';

const createCourseValidationSchema = z.object({
  body: z.object({
    title: z
      .string({
        message: 'Title is required',
      })
      .min(10, 'Title must be at least 10 characters'),
    subtitle: z.string().optional(),
    description: z.string().optional(),
    thumbnail: z.string().optional(),
    price: z
      .number({
        message: 'Price is required',
      })
      .min(0, 'Price cannot be negative'),
    categoryId: z.string({
      message: 'Category ID is required',
    }),
    duration: z.string().optional(),
    originalPrice: z.number().min(0).optional(),
    tags: z.array(z.string()).optional(),
    whatYouLearn: z.array(z.string()).optional(),
    requirements: z.array(z.string()).optional(),
    level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).optional(),
    isFree: z.boolean().optional(),
    promoVideoUrl: z
      .string()
      .url('Invalid video URL')
      .optional()
      .or(z.literal('')),
    rating: z.number().min(0).max(5).optional(),
    metaDescription: z.string().optional(),
    status: z.nativeEnum(CourseStatus).optional(),
    modules: z
      .array(
        z.object({
          title: z.string().min(1, 'Module title is required'),
          order: z.number(),
          lessons: z.array(
            z.object({
              title: z.string().min(1, 'Lesson title is required'),
              content: z.string().optional(),
              videoUrl: z
                .string()
                .url('Invalid video URL')
                .optional()
                .or(z.literal('')),
              contentType: z.enum(['video', 'text', 'quiz']).optional(),
              order: z.number(),
            })
          ),
        })
      )
      .optional(),
  }),
});

const updateLessonSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Lesson title is required').optional(),
  content: z.string().optional(),
  videoUrl: z.string().url('Invalid video URL').optional().or(z.literal('')),
  contentType: z.enum(['video', 'text', 'quiz']).optional(),
  isPreview: z.boolean().optional(),
  isFree: z.boolean().optional(),
  order: z.number().optional(),
});

const updateModuleSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Module title is required').optional(),
  order: z.number().optional(),
  lessons: z.array(updateLessonSchema).optional(),
});

const updateCourseValidationSchema = z.object({
  body: z.object({
    title: z.string().min(10).optional(),
    subtitle: z.string().optional(),
    description: z.string().optional(),
    thumbnail: z.string().optional(),
    price: z.number().min(0).optional(),
    categoryId: z.string().optional(),
    duration: z.string().optional(),
    originalPrice: z.number().min(0).optional(),
    tags: z.array(z.string()).optional(),
    whatYouLearn: z.array(z.string()).optional(),
    requirements: z.array(z.string()).optional(),
    level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']).optional(),
    isFree: z.boolean().optional(),
    promoVideoUrl: z
      .string()
      .url('Invalid video URL')
      .optional()
      .or(z.literal('')),
    rating: z.number().min(0).max(5).optional(),
    metaDescription: z.string().optional(),
    status: z.nativeEnum(CourseStatus).optional(),
    modules: z.array(updateModuleSchema).optional(),
  }),
});

export const CourseValidation = {
  createCourseValidationSchema,
  updateCourseValidationSchema,
};
