import express, { Router } from 'express';

import auth from '../../common/middlewares/auth.middleware.js';

import { AnalyticsController } from './analytics.controller.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Platform analytics and aggregations (Admin only)
 */

/**
 * @swagger
 * /analytics/overview:
 *   get:
 *     summary: Get platform overview analytics
 *     description: Returns total courses, active students, enrollment growth, and top courses. Accessible by ADMIN/SUPER_ADMIN.
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched analytics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 message: { type: string }
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalCourses: { type: integer }
 *                     totalActiveStudents: { type: integer }
 *                     enrollmentGrowth:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           date: { type: string }
 *                           count: { type: integer }
 *                     topCourses:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/TopCourse'
 */
router.get(
  '/overview',
  auth('ADMIN', 'SUPER_ADMIN'),
  AnalyticsController.getPlatformOverview
);

/**
 * @swagger
 * /analytics/revenue:
 *   get:
 *     summary: Get revenue per course
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched revenue analytics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       courseId: { type: string }
 *                       title: { type: string }
 *                       revenue: { type: number }
 */
router.get(
  '/revenue',
  auth('ADMIN', 'SUPER_ADMIN'),
  AnalyticsController.getRevenueAnalytics
);

/**
 * @swagger
 * /analytics/performance:
 *   get:
 *     summary: Get instructor completion rates
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched instructor performance
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       instructorId: { type: string }
 *                       instructorName: { type: string }
 *                       averageCompletionRate: { type: number }
 */
router.get(
  '/performance',
  auth('ADMIN', 'SUPER_ADMIN'),
  AnalyticsController.getInstructorPerformance
);

export const AnalyticsRoutes: Router = router;
