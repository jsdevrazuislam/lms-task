import type { Request, Response } from 'express';
import httpStatus from 'http-status';

import catchAsync from '../../common/utils/catchAsync.js';
import sendResponse from '../../common/utils/sendResponse.js';

import { instructorService } from './instructor.service.js';

const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
  const { id: userId } = (req as any).user;
  const result = await instructorService.getDashboardStats(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Instructor dashboard stats fetched successfully',
    data: result,
  });
});

const getInstructorCourses = catchAsync(async (req: Request, res: Response) => {
  const { id: userId } = (req as any).user;
  const result = await instructorService.getInstructorCourses(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Instructor courses fetched successfully',
    data: result,
  });
});

const getInstructorStudents = catchAsync(
  async (req: Request, res: Response) => {
    const { id: userId } = (req as any).user;
    const result = await instructorService.getInstructorStudents(userId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Instructor students fetched successfully',
      data: result,
    });
  }
);

export const instructorController = {
  getDashboardStats,
  getInstructorCourses,
  getInstructorStudents,
};
