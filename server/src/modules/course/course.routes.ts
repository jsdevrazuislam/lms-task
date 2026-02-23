import { UserRole } from '@prisma/client';
import express, { Router } from 'express';

import auth from '../../common/middlewares/auth.middleware.js';
import validateRequest from '../../common/middlewares/validateRequest.js';

import { courseController } from './course.controller.js';
import { CourseValidation } from './course.validation.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Course management
 */

/**
 * @swagger
 * /courses:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - price
 *               - categoryId
 *             properties:
 *               title:
 *                 type: string
 *               subtitle:
 *                 type: string
 *               description:
 *                 type: string
 *               thumbnail:
 *                 type: string
 *               price:
 *                 type: number
 *               categoryId:
 *                 type: string
 *               duration:
 *                 type: string
 *               level:
 *                 type: string
 *                 enum: [BEGINNER, INTERMEDIATE, ADVANCED]
 *               status:
 *                 type: string
 *                 enum: [DRAFT, PUBLISHED, ARCHIVED]
 *               modules:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     title: { type: string }
 *                     order: { type: number }
 *                     lessons:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           title: { type: string }
 *                           contentType: { type: string, enum: [video, text, quiz] }
 *                           isPreview: { type: boolean }
 *                           videoUrl: { type: string }
 *                           content: { type: string }
 *                           order: { type: number }
 *     responses:
 *       201:
 *         description: Course created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post(
  '/',
  auth(UserRole.INSTRUCTOR, UserRole.ADMIN),
  validateRequest(CourseValidation.createCourseValidationSchema),
  courseController.createCourse
);

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Get all courses with filters and pagination
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [DRAFT, PUBLISHED, ARCHIVED]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortOrder
 *         schema: { type: 'string', enum: [asc, desc] }
 *     responses:
 *       200:
 *         description: Courses fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: 'boolean' }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Course' }
 *                 meta: { $ref: '#/components/schemas/Pagination' }
 */
router.get('/', courseController.getAllCourses);

/**
 * @swagger
 * /courses/popular:
 *   get:
 *     summary: Get top 5 popular courses
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: Popular courses fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: 'boolean' }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Course' }
 */
router.get('/popular', courseController.getPopularCourses);

/**
 * @swagger
 * /courses/recommended:
 *   get:
 *     summary: Get recommended courses for the current student
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recommended courses fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: 'boolean' }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Course' }
 */
router.get('/recommended', auth(), courseController.getRecommendedCourses);

/**
 * @swagger
 * /courses/{id}:
 *   get:
 *     summary: Get course by ID
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: 'string' }
 *     responses:
 *       200:
 *         description: Course fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: 'boolean' }
 *                 data: { $ref: '#/components/schemas/Course' }
 *       404:
 *         description: Course not found
 */
router.get('/:id', courseController.getCourseById);

/**
 * @swagger
 * /courses/{id}:
 *   patch:
 *     summary: Update course details
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               subtitle:
 *                 type: string
 *               description:
 *                 type: string
 *               thumbnail:
 *                 type: string
 *               price:
 *                 type: number
 *               categoryId:
 *                 type: string
 *               duration:
 *                 type: string
 *               level:
 *                 type: string
 *                 enum: [BEGINNER, INTERMEDIATE, ADVANCED]
 *               status:
 *                 type: string
 *                 enum: [DRAFT, PUBLISHED, ARCHIVED]
 *               modules:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id: { type: string }
 *                     title: { type: string }
 *                     order: { type: number }
 *                     lessons:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id: { type: string }
 *                           title: { type: string }
 *                           contentType: { type: string, enum: [video, text, quiz] }
 *                           isPreview: { type: boolean }
 *                           videoUrl: { type: string }
 *                           content: { type: string }
 *                           order: { type: number }
 *     responses:
 *       200:
 *         description: Course updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: 'boolean' }
 *                 data: { $ref: '#/components/schemas/Course' }
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Course not found
 */
router.patch(
  '/:id',
  auth(UserRole.INSTRUCTOR, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(CourseValidation.updateCourseValidationSchema),
  courseController.updateCourse
);

/**
 * @swagger
 * /courses/{id}:
 *   delete:
 *     summary: Soft delete a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Course not found
 */
router.delete(
  '/:id',
  auth(UserRole.INSTRUCTOR, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  courseController.deleteCourse
);

/**
 * @swagger
 * /courses/{id}/lessons/{lessonId}/video-ticket:
 *   get:
 *     summary: Generate a secure streaming ticket for a lesson video
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Streaming ticket generated successfully
 *       403:
 *         description: Forbidden - Not enrolled
 *       404:
 *         description: Course or Lesson not found
 */
router.get(
  '/:id/lessons/:lessonId/video-ticket',
  auth(),
  courseController.getVideoTicket
);

/**
 * @swagger
 * /courses/{id}/lessons/{lessonId}/video-key:
 *   get:
 *     summary: Get video decryption key for a lesson
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: 'string' }
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema: { type: 'string' }
 *     responses:
 *       200:
 *         description: Video decryption key fetched successfully
 */
router.get(
  '/:id/lessons/:lessonId/video-key',
  auth(),
  courseController.getVideoKey
);

export const CourseRoutes: Router = router;
