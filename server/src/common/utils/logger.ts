import 'winston-daily-rotate-file';
import winston from 'winston';

import { getContextValue } from '../middlewares/context.middleware.js';

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

// Format to inject context values like requestId and userId
const injectContext = winston.format((info) => {
  const requestId = getContextValue('requestId');
  if (requestId) {
    info.requestId = requestId;
  }
  const userId = getContextValue('userId');
  if (userId) {
    info.userId = userId;
  }
  return info;
});

// Custom format for console logging
const consoleFormat = printf(
  ({ level, message, timestamp, stack, requestId, userId, ...metadata }) => {
    const contextStr = [requestId, userId].filter(Boolean).join('|');
    const formattedContext = contextStr ? ` [${contextStr}]` : '';

    return `${timestamp}${formattedContext} [${level}]: ${stack || message} ${
      Object.keys(metadata).length ? JSON.stringify(metadata) : ''
    }`;
  }
);

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: combine(
    injectContext(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    json()
  ),
  defaultMeta: { service: 'lms-backend' },
  transports: [
    // Console log for development
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        consoleFormat
      ),
    }),
    // Error logs with rotation
    new winston.transports.DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxFiles: '7d', // Reduced from 14d
      zippedArchive: true,
      maxSize: '20m', // Added size limit
    }),
    // Combined logs with rotation (info and above)
    new winston.transports.DailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '7d', // Reduced from 14d
      zippedArchive: true,
      maxSize: '20m', // Added size limit
    }),
  ],
});

export default logger;
