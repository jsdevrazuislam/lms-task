import type { Request, Response } from 'express';
import httpStatus from 'http-status';

import catchAsync from '../../common/utils/catchAsync.js';
import sendResponse from '../../common/utils/sendResponse.js';

import { EnrollmentService } from './enrollment.service.js';

/**
 * Enroll a student in a course
 * @param req - Express request with user info and courseId in body
 * @param res - Express response
 */
const enrollInCourse = catchAsync(async (req: Request, res: Response) => {
  const { courseId } = req.body;
  const studentId = req.user.id;

  const result = await EnrollmentService.enrollInCourse(studentId, courseId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Enrolled in course successfully',
    data: result,
  });
});

/**
 * Check if a student is enrolled in a specific course
 * @param req - Express request with courseId in params
 * @param res - Express response
 */
const getEnrollmentStatus = catchAsync(async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const studentId = req.user.id;

  const result = await EnrollmentService.getEnrollmentStatus(
    studentId,
    courseId as string
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Enrollment status fetched successfully',
    data: { isEnrolled: !!result, enrollment: result },
  });
});

/**
 * Get all course enrollments for the current student
 * @param req - Express request with user info
 * @param res - Express response
 */
const getStudentEnrollments = catchAsync(
  async (req: Request, res: Response) => {
    const studentId = req.user.id;
    const result = await EnrollmentService.getStudentEnrollments(studentId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student enrollments fetched successfully',
      data: result,
    });
  }
);

/**
 * Get learning statistics for the current student
 * @param req - Express request with user info
 * @param res - Express response
 */
const getStudentStats = catchAsync(async (req: Request, res: Response) => {
  const studentId = req.user.id;
  const result = await EnrollmentService.getStudentStats(studentId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student statistics fetched successfully',
    data: result,
  });
});

/**
 * Get all earned certificates for the current student
 * @param req - Express request with user info
 * @param res - Express response
 */
const getCertificates = catchAsync(async (req: Request, res: Response) => {
  const studentId = req.user.id;
  const result = await EnrollmentService.getCertificates(studentId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Certificates fetched successfully',
    data: result,
  });
});

/**
 * Drop a course
 * @param req - Express request with courseId in params
 * @param res - Express response
 */
const dropCourse = catchAsync(async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const studentId = req.user.id;

  const result = await EnrollmentService.dropCourse(
    studentId,
    courseId as string
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Dropped course successfully',
    data: result,
  });
});

export const EnrollmentController = {
  enrollInCourse,
  getEnrollmentStatus,
  getStudentEnrollments,
  getStudentStats,
  getCertificates,
  dropCourse,
};
