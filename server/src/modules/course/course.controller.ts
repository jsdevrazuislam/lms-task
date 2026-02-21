import type { Request, Response } from 'express';
import httpStatus from 'http-status';

import catchAsync from '../../common/utils/catchAsync.js';
import pick from '../../common/utils/pick.js';
import sendResponse from '../../common/utils/sendResponse.js';

import type { ICourseFilterRequest } from './course.interface.js';
import { courseService } from './course.service.js';

/**
 * Create a new course (Instructor/Admin only)
 * @param req - Express request with user info and course data in body
 * @param res - Express response
 */
const createCourse = catchAsync(async (req: Request, res: Response) => {
  const { id: userId } = req.user;
  const result = await courseService.createCourse(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Course created successfully',
    data: result,
  });
});

/**
 * Get all courses with optional filters and pagination
 * @param req - Express request with query filters
 * @param res - Express response
 */
const getAllCourses = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const filters = pick(req.query, [
    'searchTerm',
    'minPrice',
    'maxPrice',
    'categoryId',
    'status',
    'page',
    'limit',
    'sortBy',
    'sortOrder',
  ]) as ICourseFilterRequest;

  const result = await courseService.getAllCourses(user, filters);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Courses fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

/**
 * Get a specific course by ID
 * @param req - Express request with course ID in params
 * @param res - Express response
 */
const getCourseById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;
  const result = await courseService.getCourseById(id as string, user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course fetched successfully',
    data: result,
  });
});

/**
 * Update course details (Owner/Instructor/Admin only)
 * @param req - Express request with course ID in params and update data in body
 * @param res - Express response
 */
const updateCourse = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { id: userId, role } = req.user;
  const result = await courseService.updateCourse(
    id as string,
    userId,
    role,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course updated successfully',
    data: result,
  });
});

/**
 * Soft delete a course (Owner/Instructor/Admin only)
 * @param req - Express request with course ID in params
 * @param res - Express response
 */
const deleteCourse = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { id: userId, role } = req.user;
  await courseService.deleteCourse(id as string, userId, role);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course deleted successfully (soft-delete)',
    data: null,
  });
});

const getPopularCourses = catchAsync(async (req: Request, res: Response) => {
  const result = await courseService.getPopularCourses();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Popular courses fetched successfully',
    data: result,
  });
});

/**
 * Generate a secure streaming ticket for a lesson video
 * @param req - Express request with course and lesson IDs in params
 * @param res - Express response
 */
const getVideoTicket = catchAsync(async (req: Request, res: Response) => {
  const { id, lessonId } = req.params;
  const user = req.user;

  const result = await courseService.getVideoTicket(
    id as string,
    lessonId as string,
    user
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Streaming ticket generated successfully',
    data: result,
  });
});

/**
 * Authorize key access for encrypted video content
 * @param req - Express request with course and lesson IDs in params
 * @param res - Express response
 */
const getVideoKey = catchAsync(async (req: Request, res: Response) => {
  const { id, lessonId } = req.params;
  const user = req.user;

  const result = await courseService.getVideoKey(
    id as string,
    lessonId as string,
    user
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Key access authorized',
    data: result,
  });
});

/**
 * Get recommended courses for the current student
 * @param req - Express request with user info
 * @param res - Express response
 */
const getRecommendedCourses = catchAsync(
  async (req: Request, res: Response) => {
    const { id: studentId } = req.user;
    const result = await courseService.getRecommendedCourses(studentId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Recommended courses fetched successfully',
      data: result,
    });
  }
);

export const courseController = {
  createCourse,
  getAllCourses,
  getPopularCourses,
  getRecommendedCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  getVideoTicket,
  getVideoKey,
};
