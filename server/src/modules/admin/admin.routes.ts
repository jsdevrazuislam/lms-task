import { UserRole } from '@prisma/client';
import express from 'express';

import auth from '../../common/middlewares/auth.middleware.js';

import { adminController } from './admin.controller.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Platform administration and analytics
 */

/**
 * @swagger
 * /admin/stats:
 *   get:
 *     summary: Get dashboard statistics (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics fetched successfully
 */
router.get(
  '/stats',
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  adminController.getDashboardStats
);

export const AdminRoutes = router;
