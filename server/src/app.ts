import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import type { Application, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import httpStatus from 'http-status';
import swaggerUi from 'swagger-ui-express';

import contextMiddleware from './common/middlewares/context.middleware.js';
import globalErrorHandler from './common/middlewares/globalErrorHandler.js';
import requestLogger from './common/middlewares/requestLogger.js';
import swaggerSpec from './config/swagger.js';
import router from './routes/index.js';

const app: Application = express();

// Context Middleware (MUST BE FIRST)
app.use(contextMiddleware);

// Request Logger
app.use(requestLogger);

// Security Middlewares
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());

// Parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Limit each IP to 100 requests per `window`
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use('/api', limiter);

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Application Routes
app.use('/api/v1', router);

// Health Check
app.get('/health', (req: Request, res: Response) => {
  res.status(httpStatus.OK).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Root Route
app.get('/', (req: Request, res: Response) => {
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Welcome to the LMS Backend API',
    documentation: '/api-docs',
  });
});

// Global Error Handler
app.use(globalErrorHandler);

// Handle Not Found Routes
app.use((req: Request, res: Response) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'API Route Not Found',
    errorSources: [
      {
        path: req.originalUrl,
        message: 'Endpoint does not exist',
      },
    ],
  });
});

export default app;
