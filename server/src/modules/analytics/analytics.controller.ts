import type { Request, Response } from 'express';
import httpStatus from 'http-status';

import catchAsync from '../../common/utils/catchAsync.js';
import sendResponse from '../../common/utils/sendResponse.js';

import { AnalyticsService } from './analytics.service.js';

const getPlatformOverview = catchAsync(async (req: Request, res: Response) => {
  const [totalCourses, totalActiveStudents, enrollmentGrowth, topCourses] =
    await Promise.all([
      AnalyticsService.getTotalCourses(),
      AnalyticsService.getTotalActiveStudents(),
      AnalyticsService.getEnrollmentGrowth(),
      AnalyticsService.getTopCourses(),
    ]);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Platform overview analytics fetched successfully',
    data: {
      totalCourses,
      totalActiveStudents,
      enrollmentGrowth,
      topCourses,
    },
  });
});

const getRevenueAnalytics = catchAsync(async (req: Request, res: Response) => {
  const result = await AnalyticsService.getRevenuePerCourse();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Revenue analytics fetched successfully',
    data: result,
  });
});

const getInstructorPerformance = catchAsync(
  async (req: Request, res: Response) => {
    const result = await AnalyticsService.getInstructorCompletionRates();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Instructor performance analytics fetched successfully',
      data: result,
    });
  }
);

export const AnalyticsController = {
  getPlatformOverview,
  getRevenueAnalytics,
  getInstructorPerformance,
};
