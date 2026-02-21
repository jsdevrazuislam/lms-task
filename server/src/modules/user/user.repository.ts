import type { Prisma } from '@prisma/client';
import { UserRole } from '@prisma/client';

import prisma from '../../config/prisma.js';

import type { IUserFilterRequest } from './user.interface.js';

const findAll = async (filters: IUserFilterRequest) => {
  const {
    searchTerm,
    role,
    email,
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = filters;
  const skip = (page - 1) * limit;

  const andConditions: Prisma.UserWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: [
        { firstName: { contains: searchTerm, mode: 'insensitive' } },
        { lastName: { contains: searchTerm, mode: 'insensitive' } },
        { email: { contains: searchTerm, mode: 'insensitive' } },
      ],
    });
  }

  if (role) {
    andConditions.push({ role });
  }

  if (email) {
    andConditions.push({ email: { contains: email, mode: 'insensitive' } });
  }

  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: { [sortBy]: sortOrder },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const total = await prisma.user.count({ where: whereConditions });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const findById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

const updateRole = async (id: string, role: UserRole) => {
  return prisma.user.update({
    where: { id },
    data: { role },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
    },
  });
};

const remove = async (id: string) => {
  return prisma.user.delete({
    where: { id },
  });
};

export const userRepository = {
  findAll,
  findById,
  updateRole,
  remove,
};
