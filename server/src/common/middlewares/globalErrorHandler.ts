import type {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from 'express';
import httpStatus from 'http-status';

import logger from '../utils/logger.js';

const globalErrorHandler: ErrorRequestHandler = (
  err,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
  const success = false;
  let message = 'Something went wrong!';
  let errorSources: Array<{ path: string | number; message: string }> = [
    {
      path: '',
      message: err?.message || 'Something went wrong',
    },
  ];

  if (err?.name === 'ZodError') {
    statusCode = httpStatus.BAD_REQUEST;
    message = 'Validation Error';
    errorSources = err.issues.map((issue: any) => ({
      path: issue.path[issue.path.length - 1],
      message: issue.message,
    }));
  } else if (err?.name === 'PrismaClientKnownRequestError') {
    statusCode = httpStatus.BAD_REQUEST;
    message = 'Database Error';
    errorSources = [
      {
        path: '',
        message: err.message,
      },
    ];
  } else if (err instanceof Error) {
    message = err.message;
    errorSources = [
      {
        path: '',
        message: err?.message,
      },
    ];
  }

  // Structured Logging
  if (statusCode >= 500) {
    logger.error(`${req.method} ${req.originalUrl} - Internal Server Error`, {
      error: err,
      path: req.originalUrl,
      method: req.method,
    });
  } else {
    logger.warn(`${req.method} ${req.originalUrl} - ${message}`, {
      statusCode,
      errorSources,
    });
  }

  res.status(statusCode).json({
    success,
    message,
    errorSources,
    stack: process.env['NODE_ENV'] === 'development' ? err?.stack : null,
  });
};

export default globalErrorHandler;
