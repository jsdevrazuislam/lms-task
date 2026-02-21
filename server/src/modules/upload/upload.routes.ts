import express from 'express';

import authMiddleware from '../../common/middlewares/auth.middleware.js';

import { UploadController } from './upload.controller.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: Cloud storage and file uploads
 */

/**
 * @swagger
 * /upload/signature:
 *   get:
 *     summary: Generate Cloudinary upload signature
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Signature data
 */
router.get('/signature', authMiddleware(), UploadController.getSignature);

export const UploadRoutes = router;
