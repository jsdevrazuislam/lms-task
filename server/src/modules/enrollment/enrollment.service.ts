import { EnrollmentStatus, Prisma } from '@prisma/client';
import httpStatus from 'http-status';

import ApiError from '../../common/utils/ApiError.js';
import prisma from '../../config/prisma.js';
import { courseRepository } from '../course/course.repository.js';
import { EmailService } from '../email/email.service.js';
import { NotificationType } from '../notification/notification.interface.js';
import { NotificationService } from '../notification/notification.service.js';

import { enrollmentRepository } from './enrollment.repository.js';

type TEnrollmentWithCourse = Prisma.EnrollmentGetPayload<{
  include: {
    course: {
      include: {
        instructor: true;
        category: true;
        modules: {
          include: {
            lessons: true;
          };
        };
      };
    };
  };
}>;

/**
 * Enroll a student in a course
 * @param studentId - ID of the student
 * @param courseId - ID of the course
 * @returns The created enrollment
 */
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

  const result = await enrollmentRepository.create(studentId, courseId);

  // Fetch full details for notification and email
  const student = await prisma.user.findUnique({ where: { id: studentId } });
  const enrolledCourse = await courseRepository.findById(courseId);

  if (student && enrolledCourse) {
    // Trigger in-app notification
    await NotificationService.createNotification({
      userId: studentId,
      title: 'Course Enrollment',
      message: `You have successfully enrolled in ${enrolledCourse.title}`,
      type: NotificationType.ENROLLMENT,
    });

    // Send confirmation email
    await EmailService.sendEmail(
      'Enrollment Confirmation',
      student.email,
      `${student.firstName} ${student.lastName}`,
      {
        course_name: enrolledCourse.title,
        course_url: `${process.env.CLIENT_URL}/dashboard/student/courses/${enrolledCourse.id}`,
        instructor_name: enrolledCourse.instructor
          ? `${enrolledCourse.instructor.firstName} ${enrolledCourse.instructor.lastName}`
          : 'Instructor',
        enrollment_date: new Date().toLocaleDateString(),
        name: student.firstName,
      },
      19
    );

    // Notify Instructor (Real-time alert)
    if (enrolledCourse.instructor) {
      await NotificationService.createNotification({
        userId: enrolledCourse.instructor.id,
        title: 'New Enrollment',
        message: `${student.firstName} ${student.lastName} has enrolled in your course: ${enrolledCourse.title}`,
        type: NotificationType.INFO,
      });
    }
  }

  return result;
};

/**
 * Get the enrollment status of a student for a specific course
 * @param studentId - ID of the student
 * @param courseId - ID of the course
 * @returns The enrollment if found, otherwise null
 */
const getEnrollmentStatus = async (studentId: string, courseId: string) => {
  return await enrollmentRepository.findUnique(studentId, courseId);
};
/**
 * Get all course enrollments for a specific student with progress metrics
 * @param studentId - ID of the student
 * @returns List of enrollments with progress and lesson counts
 */
const getStudentEnrollments = async (studentId: string) => {
  const enrollments = (await enrollmentRepository.findMany(
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
  )) as unknown as TEnrollmentWithCourse[];

  return await Promise.all(
    enrollments.map(async (e) => {
      const lessons = e.course.modules.flatMap((m) => m.lessons);
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

/**
 * Get learning statistics and dashboard overview for a student
 * @param studentId - ID of the student
 * @returns Comprehensive statistics including course counts, progress, and details
 */
const getStudentStats = async (studentId: string) => {
  const enrollments = (await enrollmentRepository.findMany(
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
  )) as unknown as TEnrollmentWithCourse[];

  const totalEnrolled = enrollments.length;
  const completedCourses = enrollments.filter(
    (e) => e.status === EnrollmentStatus.COMPLETED
  ).length;
  const activeCourses = enrollments.filter(
    (e) => e.status === EnrollmentStatus.ACTIVE
  ).length;
  const droppedCourses = enrollments.filter(
    (e) => e.status === EnrollmentStatus.DROPPED
  ).length;

  // Calculate overall completion percentage
  let totalLessonsAcrossAll = 0;
  let totalCompletedLessons = 0;

  const enrollmentDetails = await Promise.all(
    enrollments.map(async (e) => {
      if (!e.course) return null;

      const course = e.course;
      const lessons = course.modules?.flatMap((m) => m.lessons) || [];
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

      const instructor = course.instructor;

      return {
        courseId: e.courseId,
        title: course.title,
        courseTitle: course.title,
        thumbnail: course.thumbnail,
        enrolledAt: e.enrolledAt,
        lastActive: lastProgress?.completedAt || e.enrolledAt,
        instructor: instructor
          ? `${instructor.firstName} ${instructor.lastName}`
          : 'Unknown',
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

  const filteredEnrollmentDetails = enrollmentDetails.filter((d) => d !== null);

  const overallProgress =
    totalLessonsAcrossAll === 0
      ? 0
      : Math.round((totalCompletedLessons / totalLessonsAcrossAll) * 100);

  return {
    totalEnrolled,
    completedCourses,
    activeCourses,
    overallProgress,
    droppedCourses,
    enrollmentDetails: filteredEnrollmentDetails,
  };
};

/**
 * Get all earned certificates for a specific student
 * @param studentId - ID of the student
 * @returns List of completed enrollments with course details
 */
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

const dropCourse = async (studentId: string, courseId: string) => {
  const [enrollment] = await enrollmentRepository.findMany({
    studentId,
    courseId,
  });

  if (!enrollment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Enrollment not found');
  }

  const result = await prisma.enrollment.update({
    where: { id: enrollment.id },
    data: { status: EnrollmentStatus.DROPPED },
  });

  // Trigger notification
  await NotificationService.createNotification({
    userId: studentId,
    title: 'Course Dropped',
    message: `You have dropped the course`,
    type: NotificationType.WARNING,
  });

  return result;
};

export const EnrollmentService = {
  enrollInCourse,
  getStudentEnrollments,
  getEnrollmentStatus,
  getStudentStats,
  getCertificates,
  dropCourse,
};
