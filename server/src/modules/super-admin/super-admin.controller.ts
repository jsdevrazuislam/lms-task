import { UserRole } from '@prisma/client';
import type { Request, Response } from 'express';
import httpStatus from 'http-status';

import catchAsync from '../../common/utils/catchAsync.js';
import sendResponse from '../../common/utils/sendResponse.js';

import { superAdminService } from './super-admin.service.js';

const getPlatformStats = catchAsync(async (req: Request, res: Response) => {
  const result = await superAdminService.getPlatformStats();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Platform statistics fetched successfully',
    data: result,
  });
});

const getRevenueTrend = catchAsync(async (req: Request, res: Response) => {
  const result = await superAdminService.getRevenueTrend();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Revenue trend fetched successfully',
    data: result,
  });
});

const getAllAdmins = catchAsync(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const result = await superAdminService.getAllAdmins(page, limit);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admins fetched successfully',
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const role = req.query.role as UserRole;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const result = await superAdminService.getAllUsers(
    role ? { role } : {},
    page,
    limit
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users fetched successfully',
    data: result,
  });
});

const getAllCourses = catchAsync(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const result = await superAdminService.getAllCourses(page, limit);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All platform courses fetched successfully',
    data: result,
  });
});

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await superAdminService.createAdmin(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Admin created successfully',
    data: result,
  });
});

const updateAdmin = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await superAdminService.updateAdmin(id as string, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin updated successfully',
    data: result,
  });
});

const overrideCourseStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const result = await superAdminService.overrideCourseStatus(
    id as string,
    status
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course status overridden successfully',
    data: result,
  });
});

const getAnalyticsOverview = catchAsync(async (req: Request, res: Response) => {
  const [topCourses, userGrowth, categoryDistribution] = await Promise.all([
    superAdminService.getTopCourses(),
    superAdminService.getUserGrowth(),
    superAdminService.getCategoryDistribution(),
  ]);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Platform analytics fetched successfully',
    data: {
      topCourses,
      userGrowth,
      categoryDistribution,
    },
  });
});

const updateSettings = catchAsync(async (req: Request, res: Response) => {
  const result = await superAdminService.updateSettings(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Platform settings updated successfully',
    data: result,
  });
});

const getSettings = catchAsync(async (req: Request, res: Response) => {
  const result = await superAdminService.getSettings();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Platform settings fetched successfully',
    data: result,
  });
});

const toggleUserStatus = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { isActive } = req.body;
  const result = await superAdminService.toggleUserStatus(id, isActive);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
    data: result,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await superAdminService.deleteUser(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User deleted successfully',
    data: null,
  });
});

export const superAdminController = {
  getPlatformStats,
  getRevenueTrend,
  getAllAdmins,
  getAllUsers,
  getAllCourses,
  createAdmin,
  updateAdmin,
  overrideCourseStatus,
  updateSettings,
  getSettings,
  getAnalyticsOverview,
  toggleUserStatus,
  deleteUser,
};
