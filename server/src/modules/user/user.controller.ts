import type { Request, Response } from 'express';
import httpStatus from 'http-status';

import catchAsync from '../../common/utils/catchAsync.js';
import pick from '../../common/utils/pick.js';
import sendResponse from '../../common/utils/sendResponse.js';

import type { IUserFilterRequest } from './user.interface.js';
import { userService } from './user.service.js';

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const query = pick(req.query, [
    'searchTerm',
    'role',
    'email',
    'page',
    'limit',
    'sortBy',
    'sortOrder',
  ]);

  const filters: IUserFilterRequest = {
    ...query,
    page: query.page ? Number(query.page) : undefined,
    limit: query.limit ? Number(query.limit) : undefined,
  } as IUserFilterRequest;

  const result = await userService.getAllUsers(filters);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await userService.getSingleUser(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User fetched successfully',
    data: result,
  });
});

const updateUserRole = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;
  const result = await userService.updateUserRole(id as string, role);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User role updated successfully',
    data: result,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await userService.deleteUser(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User deleted successfully',
    data: null,
  });
});

export const userController = {
  getAllUsers,
  getSingleUser,
  updateUserRole,
  deleteUser,
};
