import { UserRole } from '@prisma/client';
import express from 'express';

import auth from '../../common/middlewares/auth.middleware.js';

import { ProgressController } from './progress.controller.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Progress
 *   description: Student learning progress tracking
 */

/**
 * @swagger
 * /student/lessons/{lessonId}/toggle:
 *   patch:
 *     summary: Toggle lesson completion status
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema: { type: 'string' }
 *     responses:
 *       200:
 *         description: Status toggled successfully
 */
router.patch(
  '/lessons/:lessonId/toggle',
  auth(UserRole.STUDENT),
  ProgressController.toggleLessonCompletion
);

/**
 * @swagger
 * /student/courses/{courseId}:
 *   get:
 *     summary: Get overall course progress
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema: { type: 'string' }
 *     responses:
 *       200:
 *         description: Progress data
 */
router.get(
  '/courses/:courseId',
  auth(UserRole.STUDENT),
  ProgressController.getCourseProgress
);

export const ProgressRoutes = router;
