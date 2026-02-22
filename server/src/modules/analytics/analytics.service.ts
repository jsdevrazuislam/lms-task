import { EnrollmentStatus, PaymentStatus } from '@prisma/client';

import prisma from '../../config/prisma.js';

import type {
  IEnrollmentGrowth,
  ITopCourse,
  IRevenuePerCourse,
  IInstructorCompletionRate,
} from './analytics.interface.js';

/**
 * Get total number of courses (not soft-deleted)
 */
const getTotalCourses = async (): Promise<number> => {
  return prisma.course.count({
    where: { isDeleted: false },
  });
};

/**
 * Get total number of unique students with at least one active enrollment
 */
const getTotalActiveStudents = async (): Promise<number> => {
  const result = await prisma.enrollment.groupBy({
    by: ['studentId'],
    where: { status: EnrollmentStatus.ACTIVE },
  });
  return result.length;
};

/**
 * Get enrollment growth for the last 10 days
 */
const getEnrollmentGrowth = async (): Promise<IEnrollmentGrowth[]> => {
  const tenDaysAgo = new Date();
  tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
  tenDaysAgo.setHours(0, 0, 0, 0);

  const enrollments = await prisma.enrollment.findMany({
    where: {
      enrolledAt: { gte: tenDaysAgo },
    },
    select: { enrolledAt: true },
  });

  const growthMap: Record<string, number> = {};

  // Initialize map with last 10 days
  for (let i = 0; i < 10; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateKey = d.toISOString().split('T')[0];
    if (dateKey) growthMap[dateKey] = 0;
  }

  enrollments.forEach((e) => {
    const dateKey = e.enrolledAt.toISOString().split('T')[0];
    if (dateKey && growthMap[dateKey] !== undefined) {
      growthMap[dateKey]++;
    }
  });

  return Object.entries(growthMap)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

/**
 * Get top 5 popular courses by enrollment count
 */
const getTopCourses = async (): Promise<ITopCourse[]> => {
  const topCourses = await prisma.course.findMany({
    where: { isDeleted: false },
    select: {
      id: true,
      title: true,
      instructor: {
        select: { firstName: true, lastName: true },
      },
      _count: {
        select: { enrollments: true },
      },
      payments: {
        where: { status: PaymentStatus.SUCCESS },
        select: { amount: true },
      },
    },
    orderBy: {
      enrollments: {
        _count: 'desc',
      },
    },
    take: 5,
  });

  return topCourses.map((c) => ({
    id: c.id,
    title: c.title,
    instructorName: `${c.instructor.firstName} ${c.instructor.lastName}`,
    enrollmentCount: c._count.enrollments,
    revenue: c.payments.reduce((sum, p) => sum + p.amount, 0),
  }));
};

/**
 * Get revenue per course for all published courses
 */
const getRevenuePerCourse = async (): Promise<IRevenuePerCourse[]> => {
  const courses = await prisma.course.findMany({
    where: { isDeleted: false, status: 'PUBLISHED' },
    select: {
      id: true,
      title: true,
      payments: {
        where: { status: PaymentStatus.SUCCESS },
        select: { amount: true },
      },
    },
  });

  return courses.map((c) => ({
    courseId: c.id,
    title: c.title,
    revenue: c.payments.reduce((sum, p) => sum + p.amount, 0),
  }));
};

/**
 * Get completion rate per instructor
 */
const getInstructorCompletionRates = async (): Promise<
  IInstructorCompletionRate[]
> => {
  const instructors = await prisma.user.findMany({
    where: { role: 'INSTRUCTOR' },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      courses: {
        where: { isDeleted: false },
        select: {
          id: true,
          modules: {
            select: {
              lessons: { select: { id: true } },
            },
          },
          enrollments: {
            select: {
              studentId: true,
            },
          },
        },
      },
    },
  });

  const rates: IInstructorCompletionRate[] = [];

  for (const instructor of instructors) {
    let totalProgress = 0;
    let enrollmentCount = 0;

    for (const course of instructor.courses) {
      const lessons = course.modules.flatMap(
        (m: { lessons: { id: string }[] }) => m.lessons
      );
      const totalLessons = lessons.length;
      if (totalLessons === 0) continue;

      for (const enrollment of course.enrollments) {
        const completedLessons = await prisma.lessonProgress.count({
          where: {
            studentId: enrollment.studentId,
            lesson: { module: { courseId: course.id } },
            isCompleted: true,
          },
        });

        totalProgress += (completedLessons / totalLessons) * 100;
        enrollmentCount++;
      }
    }

    rates.push({
      instructorId: instructor.id,
      instructorName: `${instructor.firstName} ${instructor.lastName}`,
      averageCompletionRate:
        enrollmentCount > 0 ? Math.round(totalProgress / enrollmentCount) : 0,
    });
  }

  return rates;
};

export const AnalyticsService = {
  getTotalCourses,
  getTotalActiveStudents,
  getEnrollmentGrowth,
  getTopCourses,
  getRevenuePerCourse,
  getInstructorCompletionRates,
};
