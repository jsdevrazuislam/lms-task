import type { Request, Response } from 'express';
import httpStatus from 'http-status';

import catchAsync from '../../common/utils/catchAsync.js';
import sendResponse from '../../common/utils/sendResponse.js';

import { ProgressService } from './progress.service.js';

const toggleLessonCompletion = catchAsync(
  async (req: Request, res: Response) => {
    const { lessonId } = req.params;
    const studentId = (req as any).user.id;

    const result = await ProgressService.toggleLessonCompletion(
      studentId,
      lessonId as string
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Lesson completion status updated successfully',
      data: result,
    });
  }
);

const getCourseProgress = catchAsync(async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const studentId = (req as any).user.id;

  const result = await ProgressService.getCourseProgress(
    studentId,
    courseId as string
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course progress fetched successfully',
    data: result,
  });
});

export const ProgressController = {
  toggleLessonCompletion,
  getCourseProgress,
};
