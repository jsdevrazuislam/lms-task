import { EnrollmentStatus, Prisma } from '@prisma/client';

import prisma from '../../config/prisma.js';

/**
 * Create a new enrollment for a student in a course
 * @param studentId - ID of the student
 * @param courseId - ID of the course
 * @returns The created enrollment with course and instructor info
 */
const create = async (studentId: string, courseId: string) => {
  return await prisma.$transaction(async (tx) => {
    return await tx.enrollment.create({
      data: {
        studentId,
        courseId,
        status: EnrollmentStatus.ACTIVE,
      },
      include: {
        course: {
          include: {
            instructor: true,
          },
        },
      },
    });
  });
};

/**
 * Find a unique enrollment record
 * @param studentId - ID of the student
 * @param courseId - ID of the course
 * @returns The enrollment with course and instructor info if found
 */
const findUnique = async (studentId: string, courseId: string) => {
  return prisma.enrollment.findUnique({
    where: {
      studentId_courseId: {
        studentId,
        courseId,
      },
    },
    include: {
      course: {
        include: {
          instructor: true,
        },
      },
    },
  });
};

/**
 * Find multiple enrollments based on criteria
 * @param where - Filtering criteria
 * @param include - Related data to include
 * @param orderBy - Sorting criteria
 */
const findMany = async (
  where: Prisma.EnrollmentWhereInput,
  include?: Prisma.EnrollmentInclude,
  orderBy?: Prisma.EnrollmentOrderByWithRelationInput
) => {
  return prisma.enrollment.findMany({
    where,
    ...(include ? { include } : {}),
    ...(orderBy ? { orderBy } : {}),
  });
};

const countLessonProgress = async (where: Prisma.LessonProgressWhereInput) => {
  return prisma.lessonProgress.count({
    where,
  });
};

/**
 * Find the first lesson progress record for a student in a course
 * @param where - Filtering criteria
 * @param orderBy - Sorting criteria
 */
const findFirstLessonProgress = async (
  where: Prisma.LessonProgressWhereInput,
  orderBy?: Prisma.LessonProgressOrderByWithRelationInput
) => {
  return prisma.lessonProgress.findFirst({
    where,
    ...(orderBy ? { orderBy } : {}),
  });
};

export const enrollmentRepository = {
  create,
  findUnique,
  findMany,
  countLessonProgress,
  findFirstLessonProgress,
};
