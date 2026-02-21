import type { NextFunction, Request, Response } from 'express';

import logger from '../utils/logger.js';

const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();

  // Log on response finish
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const { method, originalUrl, ip } = req;
    const { statusCode } = res;

    const logData = {
      method,
      url: originalUrl,
      status: statusCode,
      duration: `${duration}ms`,
      ip,
      userAgent: req.get('user-agent'),
    };

    if (statusCode >= 500) {
      logger.error('Request failed', logData);
    } else if (statusCode >= 400) {
      logger.warn('Request client error', logData);
    } else {
      logger.info('Request processed', logData);
    }
  });

  next();
};

export default requestLogger;
