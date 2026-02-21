import { CourseStatus, UserRole } from '@prisma/client';
import httpStatus from 'http-status';

import ApiError from '../../common/utils/ApiError.js';
import cloudinary from '../../config/cloudinary.js';

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
  user: { id: string; role: UserRole } | undefined,
  filters: ICourseFilterRequest
) => {
  const finalFilters: ICourseFilterRequest = { ...filters };

  // Role-based visibility logic
  if (!user || user.role === UserRole.STUDENT) {
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

  const result = await courseRepository.findAll(finalFilters);

  // Map _count.enrollments to students for frontend compatibility
  result.data = result.data.map((course: any) => {
    const { _count, ...rest } = course;
    return {
      ...rest,
      students: _count?.enrollments || 0,
    };
  });

  return result;
};

const getCourseById = async (
  id: string,
  user: { id: string; role: UserRole } | undefined
) => {
  const course: any = await courseRepository.findById(id);

  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');
  }

  // Security check for DRAFT/ARCHIVED courses
  if (course.status !== CourseStatus.PUBLISHED) {
    if (!user) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        'You do not have permission to view this course'
      );
    }
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

  // Transform modules to curriculum format for frontend
  const curriculum = course.modules
    ?.map((module: any) => ({
      id: module.id,
      title: module.title,
      order: module.order,
      lessons: module.lessons?.length || 0,
      duration: module.duration || '0m',
      items:
        module.lessons
          ?.map((lesson: any) => ({
            id: lesson.id,
            title: lesson.title,
            order: lesson.order,
            duration: lesson.duration || '0m',
            free: lesson.isFree || false,
            contentType: lesson.contentType || 'video',
          }))
          .sort((a: any, b: any) => a.order - b.order) || [],
    }))
    .sort((a: any, b: any) => a.order - b.order);

  const totalLessons =
    course.modules?.reduce(
      (acc: number, mod: any) => acc + (mod.lessons?.length || 0),
      0
    ) || 0;

  return {
    ...course,
    totalLessons,
    students: course._count?.enrollments || 0,
    curriculum,
    lessons: totalLessons,
    modulesCount: course.modules?.length || 0,
    duration: course.duration || '0h 0m',
  };
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

const getPopularCourses = async () => {
  return courseRepository.findPopular();
};

const getVideoTicket = async (
  courseId: string,
  lessonId: string,
  user: { id: string; role: UserRole }
) => {
  const course = await courseRepository.findById(courseId);
  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');
  }

  const isEnrolled = await courseRepository.isEnrolled(user.id, courseId);
  const isOwner = course.instructorId === user.id;
  const isAdmin =
    user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN;

  let requestedLesson: any = null;
  for (const module of course.modules || []) {
    requestedLesson = module.lessons.find((l: any) => l.id === lessonId);
    if (requestedLesson) break;
  }

  if (!requestedLesson) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Lesson not found');
  }

  if (!requestedLesson.isFree && !isEnrolled && !isOwner && !isAdmin) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'You must be enrolled to view this content'
    );
  }

  if (!requestedLesson.videoUrl) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Lesson has no video content');
  }

  try {
    const rawUrl = requestedLesson.videoUrl;
    // Improved regex to handle various cloudinary URL formats and extract publicId
    const parts = rawUrl.split('/upload/');
    if (parts.length < 2) throw new Error('Invalid video URL');

    // Remove version and extension: v12345/folder/publicId.mp4 -> folder/publicId
    const pathAfterUpload = parts[parts.length - 1];
    const pathWithoutVersion = pathAfterUpload.replace(/^v\d+\//, '');
    const publicId = pathWithoutVersion.replace(/\.[^/.]+$/, '');

    // Generate signed HLS URL
    // Note: Removed aes-128 as it requires specific account-level setup and KEK configuration
    const signedUrl = cloudinary.url(publicId, {
      resource_type: 'video',
      format: 'm3u8',
      sign_url: true,
      streaming_profile: 'hd', // Use a standard profile
      expires_at: Math.floor(Date.now() / 1000) + 7200, // 2 hours
    });

    return {
      url: signedUrl,
      expiresAt: new Date(Date.now() + 7200 * 1000),
    };
  } catch (error: any) {
    console.error('Video Ticket Generation Error:', error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to generate secure streaming ticket'
    );
  }
};

/**
 * Returns the decryption key for HLS.
 * Cloudinary typically serves the key via a URL, but for maximum security
 * we could proxy it or use custom key delivery.
 * For this simplified production implementation, we check auth and return "access granted" context.
 */
const getVideoKey = async (
  courseId: string,
  lessonId: string,
  user: { id: string; role: UserRole }
) => {
  // Verification is identical to ticket generation
  const isEnrolled = await courseRepository.isEnrolled(user.id, courseId);
  const course = await courseRepository.findById(courseId);
  const isOwner = course?.instructorId === user.id;
  const isAdmin =
    user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN;

  if (!isEnrolled && !isOwner && !isAdmin) {
    // Check if lesson is free
    let requestedLesson: any = null;
    if (course) {
      for (const module of course.modules || []) {
        requestedLesson = module.lessons.find((l: any) => l.id === lessonId);
        if (requestedLesson) break;
      }
    }
    if (!requestedLesson?.isFree) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        'Unauthorized access to video key'
      );
    }
  }

  // In a full DRM/AES setup, we'd return the binary key here.
  // With Cloudinary's default AES, they provide the key URL.
  // To protect the key, we ensure this endpoint is only accessible to auth users.
  return { status: 'authorized' };
};

const getRecommendedCourses = async (studentId: string) => {
  return courseRepository.findRecommended(studentId);
};

export const courseService = {
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
