import { Prisma } from '@prisma/client';

import prisma from '../../config/prisma.js';

import type {
  ICourseFilterRequest,
  ICreateCourse,
  IUpdateCourse,
} from './course.interface.js';

const create = async (instructorId: string, data: ICreateCourse) => {
  return prisma.course.create({
    data: {
      ...data,
      instructorId,
    },
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
  } = filters;

  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  const andConditions: Prisma.CourseWhereInput[] = [{ isDeleted: false }];

  if (searchTerm) {
    andConditions.push({
      OR: [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
      ],
    });
  }

  if (categoryId) {
    andConditions.push({ categoryId });
  }

  if (status) {
    andConditions.push({ status });
  }

  if (minPrice || maxPrice) {
    const priceFilter: Prisma.FloatFilter = {};
    if (minPrice) priceFilter.gte = Number(minPrice);
    if (maxPrice) priceFilter.lte = Number(maxPrice);
    andConditions.push({ price: priceFilter });
  }

  const whereConditions: Prisma.CourseWhereInput = { AND: andConditions };

  const [result, total] = await Promise.all([
    prisma.course.findMany({
      where: whereConditions,
      skip,
      take,
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
      },
    }),
    prisma.course.count({ where: whereConditions }),
  ]);

  return {
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPage: Math.ceil(total / take),
    },
    data: result,
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
    },
  });
};

const update = async (id: string, data: IUpdateCourse) => {
  return prisma.course.update({
    where: { id },
    data,
    include: {
      category: true,
    },
  });
};

const softDelete = async (id: string) => {
  return prisma.course.update({
    where: { id },
    data: { isDeleted: true },
  });
};

const findCategoryById = async (id: string) => {
  return prisma.category.findUnique({
    where: { id },
  });
};

export const courseRepository = {
  create,
  findAll,
  findById,
  update,
  softDelete,
  findCategoryById,
};
