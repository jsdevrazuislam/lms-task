import type { Prisma } from '@prisma/client';
import { UserRole } from '@prisma/client';

import prisma from '../../config/prisma.js';
import type { ITokenPayload } from '../auth/auth.interface.js';

import type { IUserFilterRequest } from './user.interface.js';

const findAll = async (
  filters: IUserFilterRequest,
  requester?: ITokenPayload
) => {
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

  // Role visibility restrictions
  if (requester?.role === UserRole.ADMIN) {
    if (role) {
      if (role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN) {
        // Admins cannot see other admins or super admins
        andConditions.push({ id: '00000000-0000-0000-0000-000000000000' });
      } else {
        andConditions.push({ role });
      }
    } else {
      // Default view for Admin: only Students and Instructors
      andConditions.push({
        role: { in: [UserRole.STUDENT, UserRole.INSTRUCTOR] },
      });
    }
  } else if (role) {
    andConditions.push({ role });
  }

  if (searchTerm) {
    andConditions.push({
      OR: [
        { firstName: { contains: searchTerm, mode: 'insensitive' } },
        { lastName: { contains: searchTerm, mode: 'insensitive' } },
        { email: { contains: searchTerm, mode: 'insensitive' } },
      ],
    });
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
      isActive: true,
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
      isActive: true,
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
      isActive: true,
    },
  });
};

const updateStatus = async (id: string, isActive: boolean) => {
  return prisma.user.update({
    where: { id },
    data: { isActive },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      isActive: true,
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
  updateStatus,
  remove,
};
