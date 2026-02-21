import { z } from 'zod';

export const EnrollmentValidation = {
  create: z.object({
    body: z.object({
      courseId: z.string().min(1, 'Course ID is required'),
    }),
  }),
};
