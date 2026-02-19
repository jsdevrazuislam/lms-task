import { CourseStatus, UserRole } from '@prisma/client';
import httpStatus from 'http-status';

import ApiError from '../../common/utils/ApiError.js';

import type {
  ICourseFilterRequest,
  ICreateCourse,
  IUpdateCourse,
} from './course.interface.js';
import { courseRepository } from './course.repository.js';

const createCourse = async (instructorId: string, payload: ICreateCourse) => {
  // Check if category exists
  const category = await courseRepository.findCategoryById(payload.categoryId);
  if (!category) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Category does not exist');
  }

  return courseRepository.create(instructorId, payload);
};

const getAllCourses = async (
  user: { id: string; role: UserRole },
  filters: ICourseFilterRequest
) => {
  const finalFilters: ICourseFilterRequest = { ...filters };

  // Role-based visibility logic
  if (user.role === UserRole.STUDENT) {
    finalFilters.status = CourseStatus.PUBLISHED;
  } else if (user.role === UserRole.INSTRUCTOR) {
    // If instructor, by default they might want to see their own OR all published.
    // For a simple implementation, if they don't specify, we show published.
    // But requirement says "Allow Instructors to view their own courses (regardless of status)".
    // This usually means a "My Courses" endpoint or a specific filter.
    // I'll stick to the logic: if not admin, and status not provided, default to PUBLISHED.
    // Actually, I'll let the controller pass specific filters if it's a "My Courses" view.
    // For the general listing:
    if (!finalFilters.status) {
      finalFilters.status = CourseStatus.PUBLISHED;
    }
  }

  return courseRepository.findAll(finalFilters);
};

const getCourseById = async (
  id: string,
  user: { id: string; role: UserRole }
) => {
  const course = await courseRepository.findById(id);

  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');
  }

  // Security check for DRAFT/ARCHIVED courses
  if (course.status !== CourseStatus.PUBLISHED) {
    const isOwner = course.instructorId === user.id;
    const isAdmin =
      user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN;

    if (!isOwner && !isAdmin) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        'You do not have permission to view this course'
      );
    }
  }

  return course;
};

const updateCourse = async (
  id: string,
  userId: string,
  role: UserRole,
  payload: IUpdateCourse
) => {
  const course = await courseRepository.findById(id);

  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');
  }

  // Security Check
  const isOwner = course.instructorId === userId;
  const isAdmin = role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN;

  if (!isOwner && !isAdmin) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'You do not have permission to update this course'
    );
  }

  // If categoryId is being updated, check if it exists
  if (payload.categoryId) {
    const category = await courseRepository.findCategoryById(
      payload.categoryId
    );
    if (!category) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Category does not exist');
    }
  }

  return courseRepository.update(id, payload);
};

const deleteCourse = async (id: string, userId: string, role: UserRole) => {
  const course = await courseRepository.findById(id);

  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');
  }

  // Security Check
  const isOwner = course.instructorId === userId;
  const isAdmin = role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN;

  if (!isOwner && !isAdmin) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'You do not have permission to delete this course'
    );
  }

  return courseRepository.softDelete(id);
};

export const courseService = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};
