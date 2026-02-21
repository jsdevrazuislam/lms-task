import { UserRole } from '@prisma/client';
import express, { Router } from 'express';

import auth from '../../common/middlewares/auth.middleware.js';
import validateRequest from '../../common/middlewares/validateRequest.js';

import { EnrollmentController } from './enrollment.controller.js';
import { EnrollmentValidation } from './enrollment.validation.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Enrollments
 *   description: Course enrollments and student progress
 */

/**
 * @swagger
 * /enrollments:
 *   post:
 *     summary: Enroll in a course (Student only)
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [courseId]
 *             properties:
 *               courseId: { type: 'string' }
 *     responses:
 *       201:
 *         description: Enrolled successfully
 */
router.post(
  '/',
  auth(UserRole.STUDENT),
  validateRequest(EnrollmentValidation.create),
  EnrollmentController.enrollInCourse
);

/**
 * @swagger
 * /enrollments/my-courses:
 *   get:
 *     summary: Get enrolled courses for current student
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of enrollments
 */
router.get(
  '/my-courses',
  auth(UserRole.STUDENT),
  EnrollmentController.getStudentEnrollments
);

/**
 * @swagger
 * /enrollments/stats:
 *   get:
 *     summary: Get enrollment statistics for current student
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics data
 */
router.get(
  '/stats',
  auth(UserRole.STUDENT),
  EnrollmentController.getStudentStats
);

/**
 * @swagger
 * /enrollments/certificates:
 *   get:
 *     summary: Get certificates for completed courses
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of certificates
 */
router.get(
  '/certificates',
  auth(UserRole.STUDENT),
  EnrollmentController.getCertificates
);

/**
 * @swagger
 * /enrollments/status/{courseId}:
 *   get:
 *     summary: Check enrollment status for a course
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema: { type: 'string' }
 *     responses:
 *       200:
 *         description: Enrollment status
 */
router.get(
  '/status/:courseId',
  auth(UserRole.STUDENT),
  EnrollmentController.getEnrollmentStatus
);

export const EnrollmentRoutes: Router = router;
