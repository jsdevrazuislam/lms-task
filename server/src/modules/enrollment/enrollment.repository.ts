import { EnrollmentStatus, Prisma } from '@prisma/client';

import prisma from '../../config/prisma.js';

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

const findMany = async (
  where: Prisma.EnrollmentWhereInput,
  include?: Prisma.EnrollmentInclude,
  orderBy?: Prisma.EnrollmentOrderByWithRelationInput
) => {
  return prisma.enrollment.findMany({
    where,
    include: include as any,
    orderBy: orderBy as any,
  });
};

const countLessonProgress = async (where: Prisma.LessonProgressWhereInput) => {
  return prisma.lessonProgress.count({
    where,
  });
};

const findFirstLessonProgress = async (
  where: Prisma.LessonProgressWhereInput,
  orderBy?: Prisma.LessonProgressOrderByWithRelationInput
) => {
  return prisma.lessonProgress.findFirst({
    where,
    orderBy: orderBy as any,
  });
};

export const enrollmentRepository = {
  create,
  findUnique,
  findMany,
  countLessonProgress,
  findFirstLessonProgress,
};
