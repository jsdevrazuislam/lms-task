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

  // Simple revenue trend for last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const dailyRevenue = await prisma.payment.groupBy({
    by: ['createdAt'],
    where: {
      course: { instructorId },
      status: 'SUCCESS',
      createdAt: { gte: sevenDaysAgo },
    },
    _sum: { amount: true },
  });

  const revenueTrend = dailyRevenue.map((d) => ({
    name: d.createdAt.toLocaleDateString('en-US', { weekday: 'short' }),
    revenue: d._sum.amount || 0,
  }));

  return {
    totalStudents,
    avgRating,
    totalRevenue,
    totalCourses,
    revenueTrend,
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
