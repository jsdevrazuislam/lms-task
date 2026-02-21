import { UserRole } from '@prisma/client';
import { z } from 'zod';

const updateUserRoleValidationSchema = z.object({
  body: z.object({
    role: z.enum([
      UserRole.ADMIN,
      UserRole.INSTRUCTOR,
      UserRole.STUDENT,
      UserRole.SUPER_ADMIN,
    ]),
  }),
});

export const UserValidation = {
  updateUserRoleValidationSchema,
};
