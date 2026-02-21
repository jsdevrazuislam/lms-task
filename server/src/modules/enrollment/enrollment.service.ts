import { EnrollmentStatus } from '@prisma/client';
import httpStatus from 'http-status';

import ApiError from '../../common/utils/ApiError.js';
import { courseRepository } from '../course/course.repository.js';

import { enrollmentRepository } from './enrollment.repository.js';

const enrollInCourse = async (studentId: string, courseId: string) => {
  // Check if course exists
  const course = await courseRepository.findById(courseId);

  if (!course) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Course not found');
  }

  // Check if already enrolled
  const existingEnrollment = await enrollmentRepository.findUnique(
    studentId,
    courseId
  );

  if (existingEnrollment) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Already enrolled in this course'
    );
  }

  return await enrollmentRepository.create(studentId, courseId);
};

const getEnrollmentStatus = async (studentId: string, courseId: string) => {
  return await enrollmentRepository.findUnique(studentId, courseId);
};

const getStudentEnrollments = async (studentId: string) => {
  const enrollments = await enrollmentRepository.findMany(
    { studentId },
    {
      course: {
        include: {
          instructor: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          category: true,
          modules: {
            include: {
              lessons: true,
            },
          },
        },
      },
    },
    { enrolledAt: 'desc' }
  );

  return await Promise.all(
    enrollments.map(async (e: any) => {
      const lessons = e.course.modules.flatMap((m: any) => m.lessons);
      const totalLessons = lessons.length;
      const completedLessons = await enrollmentRepository.countLessonProgress({
        studentId,
        isCompleted: true,
        lesson: {
          module: {
            courseId: e.courseId,
          },
        },
      });

      return {
        ...e,
        totalLessons,
        completedLessons,
        progress:
          totalLessons === 0
            ? 0
            : Math.round((completedLessons / totalLessons) * 100),
      };
    })
  );
};

const getStudentStats = async (studentId: string) => {
  const enrollments = await enrollmentRepository.findMany(
    { studentId },
    {
      course: {
        include: {
          instructor: true,
          modules: {
            include: {
              lessons: true,
            },
          },
        },
      },
    }
  );

  const totalEnrolled = enrollments.length;
  const completedCourses = enrollments.filter(
    (e) => e.status === EnrollmentStatus.COMPLETED
  ).length;
  const activeCourses = enrollments.filter(
    (e) => e.status === EnrollmentStatus.ACTIVE
  ).length;

  // Calculate overall completion percentage
  let totalLessonsAcrossAll = 0;
  let totalCompletedLessons = 0;

  const enrollmentDetails = await Promise.all(
    enrollments.map(async (e: any) => {
      const lessons = e.course.modules.flatMap((m: any) => m.lessons);
      const lessonCount = lessons.length;
      totalLessonsAcrossAll += lessonCount;

      const completedCount = await enrollmentRepository.countLessonProgress({
        studentId,
        isCompleted: true,
        lesson: {
          module: {
            courseId: e.courseId,
          },
        },
      });
      totalCompletedLessons += completedCount;

      // Find last active lesson progress
      const lastProgress = await enrollmentRepository.findFirstLessonProgress(
        {
          studentId,
          lesson: {
            module: {
              courseId: e.courseId,
            },
          },
        },
        {
          completedAt: 'desc',
        }
      );

      return {
        courseId: e.courseId,
        title: e.course.title,
        courseTitle: e.course.title,
        thumbnail: e.course.thumbnail,
        enrolledAt: e.enrolledAt,
        lastActive: lastProgress?.completedAt || e.enrolledAt,
        instructor: `${e.course.instructor.firstName} ${e.course.instructor.lastName}`,
        progress:
          lessonCount === 0
            ? 0
            : Math.round((completedCount / lessonCount) * 100),
        totalLessons: lessonCount,
        completedLessons: completedCount,
        status: e.status,
      };
    })
  );

  const overallProgress =
    totalLessonsAcrossAll === 0
      ? 0
      : Math.round((totalCompletedLessons / totalLessonsAcrossAll) * 100);

  return {
    totalEnrolled,
    completedCourses,
    activeCourses,
    overallProgress,
    enrollmentDetails,
  };
};

const getCertificates = async (studentId: string) => {
  return await enrollmentRepository.findMany(
    {
      studentId,
      status: EnrollmentStatus.COMPLETED,
    },
    {
      course: {
        include: {
          instructor: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
    { updatedAt: 'desc' }
  );
};

export const EnrollmentService = {
  enrollInCourse,
  getEnrollmentStatus,
  getStudentEnrollments,
  getStudentStats,
  getCertificates,
};
