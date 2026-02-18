import type { NextFunction, Request, Response } from 'express';
import type { ZodTypeAny } from 'zod';

import catchAsync from '../utils/catchAsync.js';

/**
 * Middleware to validate request data against a Zod schema
 * @param schema - Zod schema to validate against
 * @returns Express middleware
 */
const validateRequest = (schema: ZodTypeAny) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
      cookies: req.cookies,
    });
    next();
  });
};

export default validateRequest;
