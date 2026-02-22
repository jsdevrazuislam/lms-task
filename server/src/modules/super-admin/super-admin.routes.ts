import { UserRole } from '@prisma/client';
import express, { Router } from 'express';

import auth from '../../common/middlewares/auth.middleware.js';

import { superAdminController } from './super-admin.controller.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: SuperAdmin
 *   description: Platform owner management and global governance
 */

/**
 * @swagger
 * /super-admin/stats:
 *   get:
 *     summary: Get platform-level KPIs and statistics
 *     tags: [SuperAdmin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Platform statistics fetched successfully
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
 *                     totalUsers: { type: number }
 *                     students: { type: number }
 *                     instructors: { type: number }
 *                     admins: { type: number }
 *                     activeCourses: { type: number }
 *                     totalRevenue: { type: number }
 */
router.get(
  '/stats',
  auth(UserRole.SUPER_ADMIN),
  superAdminController.getPlatformStats
);

/**
 * @swagger
 * /super-admin/revenue-trend:
 *   get:
 *     summary: Get revenue trend for the current year
 *     tags: [SuperAdmin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Revenue trend fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 message: { type: string }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month: { type: string }
 *                       revenue: { type: number }
 */
router.get(
  '/revenue-trend',
  auth(UserRole.SUPER_ADMIN),
  superAdminController.getRevenueTrend
);

/**
 * @swagger
 * /super-admin/analytics:
 *   get:
 *     summary: Get comprehensive platform analytics overview
 *     tags: [SuperAdmin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Platform analytics fetched successfully
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
 *                     topCourses:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id: { type: string }
 *                           title: { type: string }
 *                           instructor: { type: string }
 *                           enrollments: { type: number }
 *                           revenue: { type: number }
 *                     userGrowth:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           month: { type: string }
 *                           total: { type: number }
 *                           students: { type: number }
 *                           instructors: { type: number }
 *                     categoryDistribution:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name: { type: string }
 *                           revenue: { type: number }
 */
router.get(
  '/analytics',
  auth(UserRole.SUPER_ADMIN),
  superAdminController.getAnalyticsOverview
);

/**
 * @swagger
 * /super-admin/admins:
 *   get:
 *     summary: Get all admin users
 *     tags: [SuperAdmin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admins fetched successfully
 *   post:
 *     summary: Create a new Admin user
 *     tags: [SuperAdmin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, firstName, lastName]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *               firstName: { type: string }
 *               lastName: { type: string }
 *     responses:
 *       201:
 *         description: Admin created successfully
 */
router.get(
  '/admins',
  auth(UserRole.SUPER_ADMIN),
  superAdminController.getAllAdmins
);

router.post(
  '/admins',
  auth(UserRole.SUPER_ADMIN),
  superAdminController.createAdmin
);

/**
 * @swagger
 * /super-admin/admins/{id}:
 *   patch:
 *     summary: Update an admin user
 *     tags: [SuperAdmin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               email: { type: string }
 *     responses:
 *       200:
 *         description: Admin updated successfully
 */
router.patch(
  '/admins/:id',
  auth(UserRole.SUPER_ADMIN),
  superAdminController.updateAdmin
);

/**
 * @swagger
 * /super-admin/users:
 *   get:
 *     summary: Get all platform users with role filtering
 *     tags: [SuperAdmin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [ADMIN, INSTRUCTOR, STUDENT]
 *     responses:
 *       200:
 *         description: Users fetched successfully
 */
router.get(
  '/users',
  auth(UserRole.SUPER_ADMIN),
  superAdminController.getAllUsers
);

/**
 * @swagger
 * /super-admin/courses:
 *   get:
 *     summary: Get all platform courses for governance
 *     tags: [SuperAdmin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All platform courses fetched successfully
 */
router.get(
  '/courses',
  auth(UserRole.SUPER_ADMIN),
  superAdminController.getAllCourses
);

/**
 * @swagger
 * /super-admin/courses/{id}/status:
 *   patch:
 *     summary: Force override a course status
 *     tags: [SuperAdmin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [DRAFT, PUBLISHED, ARCHIVED]
 *     responses:
 *       200:
 *         description: Course status overridden successfully
 */
router.patch(
  '/courses/:id/status',
  auth(UserRole.SUPER_ADMIN),
  superAdminController.overrideCourseStatus
);

/**
 * @swagger
 * /super-admin/settings:
 *   patch:
 *     summary: Update global platform settings
 *     tags: [SuperAdmin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               commissionPercentage: { type: number }
 *               contactEmail: { type: string }
 *               supportEmail: { type: string }
 *               globalBannerText: { type: string }
 *               isMaintenanceMode: { type: boolean }
 *     responses:
 *       200:
 *         description: Platform settings updated successfully
 */
router.get(
  '/settings',
  auth(UserRole.SUPER_ADMIN),
  superAdminController.getSettings
);

router.patch(
  '/settings',
  auth(UserRole.SUPER_ADMIN),
  superAdminController.updateSettings
);

/**
 * @swagger
 * /super-admin/users/{id}/status:
 *   patch:
 *     summary: Toggle user active status
 *     tags: [SuperAdmin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [isActive]
 *             properties:
 *               isActive: { type: boolean }
 *     responses:
 *       200:
 *         description: User status updated successfully
 */
router.patch(
  '/users/:id/status',
  auth(UserRole.SUPER_ADMIN),
  superAdminController.toggleUserStatus
);

/**
 * @swagger
 * /super-admin/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [SuperAdmin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: User deleted successfully
 */
router.delete(
  '/users/:id',
  auth(UserRole.SUPER_ADMIN),
  superAdminController.deleteUser
);

export const SuperAdminRoutes: Router = router;
