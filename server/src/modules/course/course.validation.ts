import { CourseStatus } from '@prisma/client';
import { z } from 'zod';

const createCourseValidationSchema = z.object({
  body: z.object({
    title: z.string({
      message: 'Title is required',
    }),
    description: z.string().optional(),
    thumbnail: z.string().optional(),
    price: z.number({
      message: 'Price is required',
    }),
    categoryId: z.string({
      message: 'Category ID is required',
    }),
    status: z.nativeEnum(CourseStatus).optional(),
  }),
});

const updateCourseValidationSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    thumbnail: z.string().optional(),
    price: z.number().optional(),
    categoryId: z.string().optional(),
    status: z.nativeEnum(CourseStatus).optional(),
  }),
});

export const CourseValidation = {
  createCourseValidationSchema,
  updateCourseValidationSchema,
};
