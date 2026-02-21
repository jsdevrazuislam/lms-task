import prisma from '../../config/prisma.js';

import type {
  IInstructorDashboardStats,
  IInstructorCourseStats,
  IInstructorStudent,
} from './instructor.interface.js';

/**
 * Get instructor dashboard overview stats
 * @param instructorId - ID of the instructor
 * @returns Dashboard statistics including student count, revenue, and trends
 */
const getStats = async (
  instructorId: string
): Promise<IInstructorDashboardStats> => {
  const courses = await prisma.course.findMany({
    where: { instructorId, isDeleted: false },
    select: {
      id: true,
      rating: true,
      enrollments: {
        select: { id: true },
      },
      payments: {
        where: { status: 'SUCCESS' },
        select: { amount: true },
      },
    },
  });

  const totalCourses = courses.length;
  const totalStudents = courses.reduce(
    (acc: number, c) => acc + (c.enrollments?.length || 0),
    0
  );
  const totalRevenue = courses.reduce(
    (acc: number, c) =>
      acc + (c.payments?.reduce((sum: number, p) => sum + p.amount, 0) || 0),
    0
  );
  const avgRating =
    totalCourses > 0
      ? courses.reduce((acc, c) => acc + c.rating, 0) / totalCourses
      : 0;

  // Revenue trends: Fetch all successful payments for the last year
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  oneYearAgo.setHours(0, 0, 0, 0);

  const payments = await prisma.payment.findMany({
    where: {
      course: { instructorId },
      status: 'SUCCESS',
      createdAt: { gte: oneYearAgo },
    },
    select: {
      amount: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'asc' },
  });

  // Aggregate monthly trend (last 12 months)
  const monthlyData: Record<string, { name: string; revenue: number }> = {};
  for (let i = 11; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const name = d.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
    monthlyData[key] = { name, revenue: 0 };
  }

  payments.forEach((p) => {
    const key = `${p.createdAt.getFullYear()}-${p.createdAt.getMonth()}`;
    const entry = monthlyData[key];
    if (entry) {
      entry.revenue += p.amount;
    }
  });

  const revenueTrend = Object.values(monthlyData);

  // Aggregate daily trend (last 14 days)
  const dailyData: Record<string, { name: string; revenue: number }> = {};
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const keyStr = d.toISOString().split('T')[0];
    const name = d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    if (keyStr) dailyData[keyStr] = { name, revenue: 0 };
  }

  payments.forEach((p) => {
    const keyStr = p.createdAt.toISOString().split('T')[0];
    if (keyStr) {
      const entry = dailyData[keyStr];
      if (entry) {
        entry.revenue += p.amount;
      }
    }
  });

  const dailyTrend = Object.values(dailyData);

  return {
    totalStudents,
    avgRating,
    totalRevenue,
    totalCourses,
    revenueTrend,
    dailyTrend,
  };
};

/**
 * Get all courses for an instructor with performance metrics
 * @param instructorId - ID of the instructor
 * @returns List of course stats
 */
const getCourses = async (
  instructorId: string
): Promise<IInstructorCourseStats[]> => {
  const courses = await prisma.course.findMany({
    where: { instructorId, isDeleted: false },
    include: {
      _count: {
        select: { enrollments: true },
      },
      payments: {
        where: { status: 'SUCCESS' },
        select: { amount: true },
      },
    },
  });

  return courses.map((c) => ({
    id: c.id,
    title: c.title,
    thumbnail: c.thumbnail,
    price: c.price,
    status: c.status,
    enrolledStudents: c._count.enrollments,
    revenue: c.payments.reduce((acc: number, p) => acc + p.amount, 0),
    rating: c.rating,
  }));
};

/**
 * Get roster of students enrolled in any of the instructor's courses
 * @param instructorId - ID of the instructor
 * @returns List of students with progress info
 */
const getStudents = async (
  instructorId: string
): Promise<IInstructorStudent[]> => {
  const enrollments = await prisma.enrollment.findMany({
    where: {
      course: { instructorId },
    },
    include: {
      student: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      course: {
        select: {
          title: true,
          modules: {
            include: {
              lessons: {
                select: { id: true },
              },
            },
          },
        },
      },
    },
  });

  // Calculate progress for each enrollment
  const studentData = await Promise.all(
    enrollments.map(async (e) => {
      const totalLessons = e.course.modules.reduce(
        (acc, m) => acc + m.lessons.length,
        0
      );
      const completedLessons = await prisma.lessonProgress.count({
        where: {
          studentId: e.studentId,
          lesson: { module: { courseId: e.courseId } },
          isCompleted: true,
        },
      });

      const progress =
        totalLessons > 0
          ? Math.round((completedLessons / totalLessons) * 100)
          : 0;

      return {
        id: e.student.id,
        name: `${e.student.firstName} ${e.student.lastName}`,
        email: e.student.email,
        avatar: null, // Avatar not in schema yet, could add later
        courseTitle: e.course.title,
        progress,
        status: e.status.toLowerCase(),
        enrolledAt: e.enrolledAt,
        lastActive: e.updatedAt, // Using updatedAt as a proxy for last active
      };
    })
  );

  return studentData;
};

export const instructorRepository = {
  getStats,
  getCourses,
  getStudents,
};
