import { CourseStatus, PaymentStatus, UserRole } from '@prisma/client';

import prisma from '../../config/prisma.js';

import type {
  IAdminCreationData,
  IAdminUpdateData,
  IPlatformSettingsData,
} from './super-admin.interface.js';

/**
 * Get platform-level KPIs
 */
const getPlatformStats = async () => {
  const [
    totalStudents,
    totalInstructors,
    totalAdmins,
    activeCourses,
    payments,
  ] = await Promise.all([
    prisma.user.count({ where: { role: UserRole.STUDENT } }),
    prisma.user.count({ where: { role: UserRole.INSTRUCTOR } }),
    prisma.user.count({ where: { role: UserRole.ADMIN } }),
    prisma.course.count({ where: { isDeleted: false, status: 'PUBLISHED' } }),
    prisma.payment.findMany({
      where: { status: PaymentStatus.SUCCESS },
      select: { amount: true },
    }),
  ]);

  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

  return {
    totalUsers: totalStudents + totalInstructors + totalAdmins,
    students: totalStudents,
    instructors: totalInstructors,
    admins: totalAdmins,
    activeCourses,
    totalRevenue,
  };
};

/**
 * Get revenue trend for the current year
 */
const getRevenueTrend = async () => {
  const currentYear = new Date().getFullYear();
  const startOfYear = new Date(currentYear, 0, 1);

  const payments = await prisma.payment.findMany({
    where: {
      status: PaymentStatus.SUCCESS,
      createdAt: { gte: startOfYear },
    },
    select: { amount: true, createdAt: true },
  });

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const monthlyRevenue: Record<string, number> = {};
  months.forEach((m) => (monthlyRevenue[m] = 0));

  payments.forEach((p) => {
    const month = p.createdAt.toLocaleString('default', { month: 'short' });
    if (monthlyRevenue[month] !== undefined) {
      monthlyRevenue[month] += p.amount;
    }
  });

  return Object.entries(monthlyRevenue).map(([month, revenue]) => ({
    month,
    revenue,
  }));
};

/**
 * Get all admin users with pagination
 */
const getAllAdmins = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [admins, total] = await Promise.all([
    prisma.user.findMany({
      where: { role: UserRole.ADMIN },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ where: { role: UserRole.ADMIN } }),
  ]);

  return {
    data: admins,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get all users with filters and pagination
 */
const getAllUsers = async (
  filters: { role?: UserRole },
  page = 1,
  limit = 10
) => {
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: filters,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ where: filters }),
  ]);

  return {
    data: users,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get all courses with pagination
 */
const getAllCourses = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [courses, total] = await Promise.all([
    prisma.course.findMany({
      where: { isDeleted: false },
      include: {
        instructor: {
          select: { firstName: true, lastName: true },
        },
        _count: {
          select: { enrollments: true },
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.course.count({ where: { isDeleted: false } }),
  ]);

  return {
    data: courses,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/**
 * Create a new Admin
 */
const createAdmin = async (data: IAdminCreationData) => {
  return prisma.user.create({
    data: {
      ...data,
      role: UserRole.ADMIN,
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
    },
  });
};

/**
 * Force override a course status
 */
const overrideCourseStatus = async (id: string, status: string) => {
  return prisma.course.update({
    where: { id },
    data: { status: status as CourseStatus },
  });
};

/**
 * Update platform settings (mock persistence using metadata or separate table)
 * For now, we'll just mock the success as the schema doesn't have a Settings table yet.
 */
const updateSettings = async (data: IPlatformSettingsData) => {
  // In a real app, this would update a 'settings' table or a JSON config file.
  console.log('Updating platform settings:', data);
  return { success: true, ...data };
};

/**
 * Get top performing courses
 */
const getTopCourses = async (limit = 5) => {
  return prisma.course
    .findMany({
      where: { isDeleted: false, status: 'PUBLISHED' },
      include: {
        instructor: { select: { firstName: true, lastName: true } },
        _count: { select: { enrollments: true } },
        payments: {
          where: { status: PaymentStatus.SUCCESS },
          select: { amount: true },
        },
      },
      take: limit,
      // The sorting by revenue/enrollments logic
    })
    .then((courses) => {
      return courses
        .map((course) => ({
          id: course.id,
          title: course.title,
          instructor: `${course.instructor.firstName} ${course.instructor.lastName}`,
          enrollments: course._count.enrollments,
          revenue: course.payments.reduce((sum, p) => sum + p.amount, 0),
        }))
        .sort((a, b) => b.revenue - a.revenue);
    });
};

/**
 * Get user growth trend (monthly signups)
 */
const getUserGrowth = async () => {
  const currentYear = new Date().getFullYear();
  const startOfYear = new Date(currentYear, 0, 1);

  const users = await prisma.user.findMany({
    where: { createdAt: { gte: startOfYear } },
    select: { createdAt: true, role: true },
  });

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const growth: Record<
    string,
    { total: number; students: number; instructors: number }
  > = {};
  months.forEach(
    (m) => (growth[m] = { total: 0, students: 0, instructors: 0 })
  );

  users.forEach((u) => {
    const month = u.createdAt.toLocaleString('default', { month: 'short' });
    if (growth[month]) {
      growth[month].total++;
      if (u.role === UserRole.STUDENT) growth[month].students++;
      if (u.role === UserRole.INSTRUCTOR) growth[month].instructors++;
    }
  });

  return Object.entries(growth).map(([month, stats]) => ({
    month,
    ...stats,
  }));
};

/**
 * Get revenue distribution by category
 */
const getCategoryDistribution = async () => {
  const categories = await prisma.category.findMany({
    include: {
      courses: {
        select: {
          payments: {
            where: { status: PaymentStatus.SUCCESS },
            select: { amount: true },
          },
        },
      },
    },
  });

  return categories
    .map((cat) => ({
      name: cat.name,
      revenue: cat.courses.reduce(
        (catSum, course) =>
          catSum +
          course.payments.reduce((courseSum, p) => courseSum + p.amount, 0),
        0
      ),
    }))
    .filter((c) => c.revenue > 0);
};

const updateAdmin = async (id: string, data: IAdminUpdateData) => {
  return prisma.user.update({
    where: { id, role: UserRole.ADMIN },
    data,
  });
};

export const superAdminService = {
  getPlatformStats,
  getRevenueTrend,
  getAllAdmins,
  getAllUsers,
  getAllCourses,
  createAdmin,
  updateAdmin,
  overrideCourseStatus,
  updateSettings,
  getTopCourses,
  getUserGrowth,
  getCategoryDistribution,
};
