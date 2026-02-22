import { CourseStatus, Prisma } from '@prisma/client';

import prisma from '../../config/prisma.js';

import type {
  ICourseFilterRequest,
  ICreateCourse,
  IUpdateCourse,
} from './course.interface.js';

const create = async (instructorId: string, data: ICreateCourse) => {
  const { modules, categoryId, ...courseData } = data;

  const createData: Prisma.CourseCreateInput = {
    ...courseData,
    category: {
      connect: { id: categoryId },
    },
    instructor: {
      connect: { id: instructorId },
    },
  };

  if (modules && modules.length > 0) {
    createData.modules = {
      create: modules.map((module) => ({
        title: module.title,
        order: module.order,
        duration: module.duration ?? null,
        lessons: {
          create: module.lessons.map((lesson) => ({
            title: lesson.title,
            content: lesson.content ?? null,
            videoUrl: lesson.videoUrl ?? null,
            contentType: lesson.contentType ?? 'video',
            duration: lesson.duration ?? null,
            isFree: lesson.isFree ?? false,
            order: lesson.order,
          })),
        },
      })),
    };
  }

  return prisma.course.create({
    data: createData,
    include: {
      category: true,
      instructor: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
        },
      },
      modules: {
        include: {
          lessons: true,
        },
      },
    },
  });
};

const findAll = async (filters: ICourseFilterRequest) => {
  const {
    searchTerm,
    minPrice,
    maxPrice,
    categoryId,
    status,
    page = '1',
    limit = '10',
    sortBy = 'createdAt',
    sortOrder = 'desc',
    level,
    rating,
    cursor,
  } = filters;

  const take = Number(limit);

  const andConditions: Prisma.CourseWhereInput[] = [{ isDeleted: false }];

  if (searchTerm && searchTerm.trim() !== '') {
    andConditions.push({
      OR: [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
      ],
    });
  }

  if (categoryId && categoryId.trim() !== '' && categoryId !== 'All') {
    andConditions.push({
      OR: [
        { categoryId },
        { category: { name: { contains: categoryId, mode: 'insensitive' } } },
      ],
    });
  }

  if (status) {
    andConditions.push({ status });
  }

  if (level && level !== 'All Levels' && level !== 'all') {
    andConditions.push({
      level: level.toUpperCase() as Prisma.EnumCourseLevelFilter,
    });
  }

  if (rating) {
    andConditions.push({ rating: { gte: Number(rating) } });
  }

  if (
    (minPrice && minPrice.trim() !== '') ||
    (maxPrice && maxPrice.trim() !== '')
  ) {
    const priceFilter: Prisma.FloatFilter = {};
    if (minPrice && minPrice.trim() !== '') priceFilter.gte = Number(minPrice);
    if (maxPrice && maxPrice.trim() !== '') priceFilter.lte = Number(maxPrice);
    andConditions.push({ price: priceFilter });
  }

  const whereConditions: Prisma.CourseWhereInput = { AND: andConditions };

  const queryOptions: Prisma.CourseFindManyArgs = {
    where: whereConditions,
    take: take + 1,
    orderBy: { [sortBy]: sortOrder },
    include: {
      category: true,
      instructor: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      _count: {
        select: { enrollments: true },
      },
    },
  };

  if (cursor) {
    queryOptions.cursor = { id: cursor };
    queryOptions.skip = 1;
  } else {
    queryOptions.skip = (Number(page) - 1) * Number(limit);
  }

  const [result, total] = await Promise.all([
    prisma.course.findMany(queryOptions),
    prisma.course.count({ where: whereConditions }),
  ]);

  const hasNextPage = result.length > take;
  const data = hasNextPage ? result.slice(0, take) : result;
  const nextCursor =
    hasNextPage && data.length > 0 ? data[data.length - 1]!.id : null;

  return {
    meta: {
      page: Number(page),
      limit: take,
      total,
      totalPage: Math.ceil(total / take),
      nextCursor,
      hasNextPage,
    },
    data,
  };
};

const findById = async (id: string) => {
  return prisma.course.findUnique({
    where: { id, isDeleted: false },
    include: {
      category: true,
      instructor: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
        },
      },
      modules: {
        include: {
          lessons: true,
        },
      },
      _count: {
        select: { enrollments: true },
      },
    },
  });
};

const update = async (id: string, data: IUpdateCourse) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { modules, ...updateData } = data;
  return prisma.course.update({
    where: { id },
    data: updateData as Prisma.CourseUpdateInput,
    include: {
      category: true,
    },
  });
};

const softDelete = async (id: string) => {
  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    // Soft delete lessons first
    await tx.lesson.updateMany({
      where: { module: { courseId: id } },
      data: { isDeleted: true },
    });

    // Soft delete modules
    await tx.module.updateMany({
      where: { courseId: id },
      data: { isDeleted: true },
    });

    // Soft delete the course itself
    return tx.course.update({
      where: { id },
      data: { isDeleted: true },
    });
  });
};

const findPopular = async () => {
  return prisma.course.findMany({
    where: {
      status: CourseStatus.PUBLISHED,
      isDeleted: false,
    },
    take: 5,
    orderBy: [
      {
        enrollments: {
          _count: 'desc',
        },
      },
      {
        createdAt: 'desc',
      },
    ],
    include: {
      category: true,
      instructor: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });
};

const findCategoryById = async (id: string) => {
  return prisma.category.findUnique({
    where: { id },
  });
};

const isEnrolled = async (studentId: string, courseId: string) => {
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      studentId_courseId: {
        studentId,
        courseId,
      },
    },
  });
  return !!enrollment;
};

const findRecommended = async (studentId: string) => {
  // 1. Get student's enrolled course category IDs
  const enrollments = await prisma.enrollment.findMany({
    where: { studentId },
    include: {
      course: {
        select: { categoryId: true },
      },
    },
  });

  const categoryIds = Array.from(
    new Set(enrollments.map((e) => e.course.categoryId))
  );
  const enrolledCourseIds = enrollments.map((e) => e.courseId);

  // 2. Recommend courses from these categories (excluding already enrolled)
  const whereConditions: Prisma.CourseWhereInput = {
    status: CourseStatus.PUBLISHED,
    isDeleted: false,
    id: { notIn: enrolledCourseIds },
  };

  if (categoryIds.length > 0) {
    whereConditions.categoryId = { in: categoryIds };
  }

  return prisma.course.findMany({
    where: whereConditions,
    take: 5,
    orderBy: [
      {
        enrollments: {
          _count: 'desc',
        },
      },
    ],
    include: {
      category: true,
      instructor: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });
};

export const courseRepository = {
  create,
  findAll,
  findById,
  findPopular,
  findRecommended,
  update,
  softDelete,
  findCategoryById,
  isEnrolled,
};
