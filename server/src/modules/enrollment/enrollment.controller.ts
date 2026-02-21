import type { Request, Response } from 'express';
import httpStatus from 'http-status';

import catchAsync from '../../common/utils/catchAsync.js';
import sendResponse from '../../common/utils/sendResponse.js';

import { EnrollmentService } from './enrollment.service.js';

const enrollInCourse = catchAsync(async (req: Request, res: Response) => {
  const { courseId } = req.body;
  const studentId = (req as any).user.id;

  const result = await EnrollmentService.enrollInCourse(studentId, courseId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Enrolled in course successfully',
    data: result,
  });
});

const getEnrollmentStatus = catchAsync(async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const studentId = (req as any).user.id;

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

const getStudentEnrollments = catchAsync(
  async (req: Request, res: Response) => {
    const studentId = (req as any).user.id;
    const result = await EnrollmentService.getStudentEnrollments(studentId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student enrollments fetched successfully',
      data: result,
    });
  }
);

const getStudentStats = catchAsync(async (req: Request, res: Response) => {
  const studentId = (req as any).user.id;
  const result = await EnrollmentService.getStudentStats(studentId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student statistics fetched successfully',
    data: result,
  });
});

const getCertificates = catchAsync(async (req: Request, res: Response) => {
  const studentId = (req as any).user.id;
  const result = await EnrollmentService.getCertificates(studentId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Certificates fetched successfully',
    data: result,
  });
});

export const EnrollmentController = {
  enrollInCourse,
  getEnrollmentStatus,
  getStudentEnrollments,
  getStudentStats,
  getCertificates,
};
