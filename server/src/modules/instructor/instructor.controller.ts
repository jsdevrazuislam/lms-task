import type { Request, Response } from 'express';
import httpStatus from 'http-status';

import catchAsync from '../../common/utils/catchAsync.js';
import sendResponse from '../../common/utils/sendResponse.js';

import { instructorService } from './instructor.service.js';

/**
 * Get instructor dashboard overview stats
 * @param req - Express request with user info
 * @param res - Express response
 */
const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
  const { id: userId } = req.user;
  const result = await instructorService.getDashboardStats(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Instructor dashboard stats fetched successfully',
    data: result,
  });
});

/**
 * Get all courses for the current instructor
 * @param req - Express request with user info
 * @param res - Express response
 */
const getInstructorCourses = catchAsync(async (req: Request, res: Response) => {
  const { id: userId } = req.user;
  const result = await instructorService.getInstructorCourses(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Instructor courses fetched successfully',
    data: result,
  });
});

/**
 * Get list of students enrolled in instructor's courses
 * @param req - Express request with user info
 * @param res - Express response
 */
const getInstructorStudents = catchAsync(
  async (req: Request, res: Response) => {
    const { id: userId } = req.user;
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
