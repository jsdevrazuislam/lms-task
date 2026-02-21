import { PaymentStatus, UserRole } from '@prisma/client';

import prisma from '../../config/prisma.js';

const getDashboardStats = async () => {
  const [activeStudents, instructors, totalCourses, payments] =
    await Promise.all([
      prisma.user.count({ where: { role: UserRole.STUDENT } }),
      prisma.user.count({ where: { role: UserRole.INSTRUCTOR } }),
      prisma.course.count({ where: { isDeleted: false } }),
      prisma.payment.findMany({
        where: { status: PaymentStatus.SUCCESS },
        select: { amount: true },
      }),
    ]);

  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

  // Enrollment Trend (Last 10 days)
  const tenDaysAgo = new Date();
  tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

  const enrollmentsLast10Days = await prisma.enrollment.findMany({
    where: { enrolledAt: { gte: tenDaysAgo } },
    select: { enrolledAt: true },
  });

  const enrollmentTrendMap: Record<string, number> = {};
  for (let i = 0; i < 10; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateKey = d.toISOString().split('T')[0];
    if (dateKey) {
      enrollmentTrendMap[dateKey] = 0;
    }
  }

  enrollmentsLast10Days.forEach((e) => {
    const dateKey = e.enrolledAt.toISOString().split('T')[0];
    if (dateKey && enrollmentTrendMap[dateKey] !== undefined) {
      enrollmentTrendMap[dateKey]++;
    }
  });

  const enrollmentTrend = Object.entries(enrollmentTrendMap)
    .map(([date, students]) => ({ date, students }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Revenue Summary (Group by month)
  const revenueSummaryRaw = await prisma.payment.findMany({
    where: { status: PaymentStatus.SUCCESS },
    select: { amount: true, createdAt: true },
  });

  const revenueSummaryMap: Record<string, number> = {};
  revenueSummaryRaw.forEach((p) => {
    const month = p.createdAt.toLocaleString('default', { month: 'short' });
    revenueSummaryMap[month] = (revenueSummaryMap[month] || 0) + p.amount;
  });

  const revenueSummary = Object.entries(revenueSummaryMap).map(
    ([month, revenue]) => ({
      month,
      revenue,
    })
  );

  // Top Courses
  const topCoursesRaw = await prisma.course.findMany({
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
    },
    orderBy: {
      enrollments: {
        _count: 'desc',
      },
    },
    take: 5,
  });

  const topCourses = topCoursesRaw.map((c) => ({
    title: c.title,
    instructor: `${c.instructor.firstName} ${c.instructor.lastName}`,
    enrollments: c._count.enrollments,
  }));

  return {
    kpis: {
      activeStudents,
      instructors,
      totalCourses,
      totalRevenue,
    },
    enrollmentTrend,
    revenueSummary,
    topCourses,
  };
};

export const adminService = {
  getDashboardStats,
};
