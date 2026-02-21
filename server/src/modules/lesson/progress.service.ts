import httpStatus from 'http-status';

import ApiError from '../../common/utils/ApiError.js';
import prisma from '../../config/prisma.js';

const toggleLessonCompletion = async (studentId: string, lessonId: string) => {
  // Check if lesson exists
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      module: {
        include: {
          course: true,
        },
      },
    },
  });

  if (!lesson) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Lesson not found');
  }

  // Check if student is enrolled in the course
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      studentId_courseId: {
        studentId,
        courseId: lesson.module.courseId,
      },
    },
  });

  if (!enrollment) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'You must be enrolled in this course to track progress'
    );
  }

  // Toggle completion
  const existingProgress = await prisma.lessonProgress.findUnique({
    where: {
      studentId_lessonId: {
        studentId,
        lessonId,
      },
    },
  });

  if (existingProgress) {
    const updatedProgress = await prisma.lessonProgress.update({
      where: { id: existingProgress.id },
      data: {
        isCompleted: !existingProgress.isCompleted,
        completedAt: !existingProgress.isCompleted ? new Date() : null,
      },
    });

    if (updatedProgress.isCompleted) {
      await checkAndCompleteCourse(studentId, lesson.module.courseId);
    }

    return updatedProgress;
  }

  const newProgress = await prisma.lessonProgress.create({
    data: {
      studentId,
      lessonId,
      isCompleted: true,
      completedAt: new Date(),
    },
  });

  await checkAndCompleteCourse(studentId, lesson.module.courseId);

  return newProgress;
};

const checkAndCompleteCourse = async (studentId: string, courseId: string) => {
  const [totalLessons, completedLessons] = await Promise.all([
    prisma.lesson.count({
      where: { module: { courseId } },
    }),
    prisma.lessonProgress.count({
      where: {
        studentId,
        isCompleted: true,
        lesson: { module: { courseId } },
      },
    }),
  ]);

  if (totalLessons > 0 && totalLessons === completedLessons) {
    await prisma.enrollment.update({
      where: {
        studentId_courseId: {
          studentId,
          courseId,
        },
      },
      data: {
        status: 'COMPLETED',
      },
    });
  }
};

const getCourseProgress = async (studentId: string, courseId: string) => {
  const [totalLessons, completedProgress] = await Promise.all([
    prisma.lesson.count({
      where: {
        module: { courseId },
      },
    }),
    prisma.lessonProgress.findMany({
      where: {
        studentId,
        isCompleted: true,
        lesson: {
          module: { courseId },
        },
      },
      select: { lessonId: true },
    }),
  ]);

  const completedLessons = completedProgress.length;
  const percentage =
    totalLessons === 0
      ? 0
      : Math.round((completedLessons / totalLessons) * 100);

  return {
    totalLessons,
    completedLessons,
    percentage,
    completedLessonIds: completedProgress.map((p) => p.lessonId),
  };
};

export const ProgressService = {
  toggleLessonCompletion,
  getCourseProgress,
};
