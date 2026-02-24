import type { Lesson } from '@prisma/client';
import { CourseStatus, UserRole } from '@prisma/client';
import httpStatus from 'http-status';

import ApiError from '../../common/utils/ApiError.js';
import cloudinary from '../../config/cloudinary.js';
import prisma from '../../config/prisma.js';

import type {
  ICourseFilterRequest,
  ICourseResponse,
  ICreateCourse,
  TCourseWithRelations,
  IUpdateCourse,
} from './course.interface.js';
import { courseRepository } from './course.repository.js';

const createCourse = async (instructorId: string, payload: ICreateCourse) => {
  // Check if category exists
  const category = await courseRepository.findCategoryById(payload.categoryId);
  if (!category) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Category does not exist');
  }

  const result = await courseRepository.create(instructorId, payload);

  // Notify Admins (Real-time alert)
  const { emitToAdmins, SocketEvent } = await import('../../config/socket.js');
  emitToAdmins(SocketEvent.NOTIFICATION, {
    title: 'New Course Submission',
    message: `A new course "${payload.title}" has been created and is awaiting review.`,
    type: 'INFO',
  });

  return result;
};

const getAllCourses = async (
  user: { id: string; role: UserRole } | undefined,
  filters: ICourseFilterRequest
): Promise<{
  meta: { page: number; limit: number; total: number; totalPage: number };
  data: ICourseResponse[];
}> => {
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

  const { data, meta } = await courseRepository.findAll(finalFilters);

  const mappedData = (data as TCourseWithRelations[]).map((course) => {
    const { _count, ...rest } = course;
    return {
      ...rest,
      students: _count?.enrollments || 0,
    } as ICourseResponse;
  });

  return { meta, data: mappedData };
};

const getCourseById = async (
  id: string,
  user: { id: string; role: UserRole } | undefined
) => {
  const course = (await courseRepository.findById(id)) as TCourseWithRelations;

  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');
  }

  const isOwner = user ? course.instructorId === user.id : false;
  const isAdmin =
    user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN;

  const isEnrolled = user
    ? await courseRepository.isEnrolled(user.id, id)
    : false;

  // Security check for DRAFT/ARCHIVED courses
  if (course.status !== CourseStatus.PUBLISHED) {
    if (!user) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        'You do not have permission to view this course'
      );
    }

    if (!isOwner && !isAdmin) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        'You do not have permission to view this course'
      );
    }
  }

  // Strict backend filtering: Only expose videoUrl to authorized users
  const canAccessVideos = isOwner || isAdmin || isEnrolled;

  // 1. Transform modules to curriculum format for frontend
  const curriculum = course.modules
    ?.map((module) => ({
      id: module.id,
      title: module.title,
      order: module.order,
      lessons: module.lessons?.length || 0,
      duration: module.duration || '0m',
      items:
        module.lessons
          ?.map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
            order: lesson.order,
            duration: lesson.duration || '0m',
            free: lesson.isFree || false,
            videoUrl: lesson.isFree || canAccessVideos ? lesson.videoUrl : null,
            contentType: lesson.contentType || 'video',
          }))
          .sort((a, b) => a.order - b.order) || [],
    }))
    .sort((a, b) => a.order - b.order);

  // 2. Filter the raw modules array as well (security deep-defense)
  const filteredModules = course.modules?.map((module) => ({
    ...module,
    lessons: module.lessons?.map((lesson) => ({
      ...lesson,
      videoUrl: lesson.isFree || canAccessVideos ? lesson.videoUrl : null,
    })),
  }));

  const totalLessons =
    course.modules?.reduce(
      (acc: number, mod) => acc + (mod.lessons?.length || 0),
      0
    ) || 0;

  return {
    ...course,
    modules: filteredModules,
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

  const result = await courseRepository.update(id, payload);

  // Notify Students if a new lesson might have been added
  if (payload.modules && payload.modules.length > 0) {
    const enrollments = await prisma.enrollment.findMany({
      where: { courseId: id, status: 'ACTIVE' },
      select: { studentId: true },
    });

    const { NotificationService } =
      await import('../notification/notification.service.js');
    const { NotificationType } =
      await import('../notification/notification.interface.js');

    for (const enrollment of enrollments) {
      await NotificationService.createNotification({
        userId: enrollment.studentId,
        title: 'New Content Added',
        message: `A new lesson has been added to your course: ${course.title}`,
        type: NotificationType.INFO,
      });
    }
  }

  return result;
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

const getRecommendedCourses = async (studentId: string) => {
  return courseRepository.findRecommended(studentId);
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

  let requestedLesson: Lesson | null = null;
  for (const module of course.modules || []) {
    requestedLesson = module.lessons.find((l) => l.id === lessonId) || null;
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
    const parts = rawUrl.split('/upload/');
    if (parts.length < 2) throw new Error('Invalid video URL');

    const pathAfterUpload = parts[parts.length - 1]!;
    const pathWithoutVersion = pathAfterUpload.replace(/^v\d+\//, '');
    const publicId = pathWithoutVersion.replace(/\.[^/.]+$/, '');

    const signedUrl = cloudinary.url(publicId, {
      resource_type: 'video',
      format: 'm3u8',
      sign_url: true,
      streaming_profile: 'hd',
      expires_at: Math.floor(Date.now() / 1000) + 7200,
    });

    return {
      url: signedUrl,
      expiresAt: new Date(Date.now() + 7200 * 1000),
    };
  } catch (error) {
    console.error('Video Ticket Generation Error:', error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to generate secure streaming ticket'
    );
  }
};

const getVideoKey = async (
  courseId: string,
  lessonId: string,
  user: { id: string; role: UserRole }
) => {
  const isEnrolled = await courseRepository.isEnrolled(user.id, courseId);
  const course = await courseRepository.findById(courseId);
  const isOwner = course?.instructorId === user.id;
  const isAdmin =
    user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN;

  if (!isEnrolled && !isOwner && !isAdmin) {
    let requestedLesson: Lesson | null = null;
    if (course) {
      for (const module of course.modules || []) {
        requestedLesson = module.lessons.find((l) => l.id === lessonId) || null;
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

  return { status: 'authorized' };
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
