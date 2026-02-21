import { UserRole } from '@prisma/client';
import httpStatus from 'http-status';

import ApiError from '../../common/utils/ApiError.js';

import type { IUserFilterRequest } from './user.interface.js';
import { userRepository } from './user.repository.js';

const getAllUsers = async (filters: IUserFilterRequest) => {
  return userRepository.findAll(filters);
};

const getSingleUser = async (id: string) => {
  const user = await userRepository.findById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  return user;
};

const updateUserRole = async (id: string, role: UserRole) => {
  const user = await userRepository.findById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  return userRepository.updateRole(id, role);
};

const deleteUser = async (id: string) => {
  const user = await userRepository.findById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  return userRepository.remove(id);
};

export const userService = {
  getAllUsers,
  getSingleUser,
  updateUserRole,
  deleteUser,
};
