import { UserRole } from '@prisma/client';
import express from 'express';

import auth from '../../common/middlewares/auth.middleware.js';

import { instructorController } from './instructor.controller.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Instructor
 *   description: Instructor dashboards and analytics
 */

/**
 * @swagger
 * /instructor/dashboard/stats:
 *   get:
 *     summary: Get instructor dashboard overview stats
 *     tags: [Instructor]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats fetched successfully
 */
router.get(
  '/dashboard/stats',
  auth(UserRole.INSTRUCTOR, UserRole.ADMIN),
  instructorController.getDashboardStats
);

/**
 * @swagger
 * /instructor/courses:
 *   get:
 *     summary: Get instructor courses with metrics
 *     tags: [Instructor]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Instructor courses fetched successfully
 */
router.get(
  '/courses',
  auth(UserRole.INSTRUCTOR, UserRole.ADMIN),
  instructorController.getInstructorCourses
);

/**
 * @swagger
 * /instructor/students:
 *   get:
 *     summary: Get instructor students roster
 *     tags: [Instructor]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Instructor students fetched successfully
 */
router.get(
  '/students',
  auth(UserRole.INSTRUCTOR, UserRole.ADMIN),
  instructorController.getInstructorStudents
);

export const InstructorRoutes: express.Router = router;
