import type { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';

import config from '../../config/index.js';
import type { TUserRole } from '../constants/roles.js';
import ApiError from '../utils/ApiError.js';
import catchAsync from '../utils/catchAsync.js';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token =
      req.cookies?.accessToken ||
      req.headers.authorization?.replace('Bearer ', '');

    // Check if the token is present
    if (!token) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
    }

    // Verify the token
    let decoded: JwtPayload;
    try {
      const verifiedUser = jwt.verify(
        token,
        config.jwt_access_secret as string
      ) as JwtPayload;
      decoded = verifiedUser;
    } catch {
      res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: 'Invalid or expired token',
      });
      return; // Stop execution if token is invalid/expired
    }

    const { role } = decoded;

    // Check if the user has the required roles
    if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
      throw new ApiError(httpStatus.FORBIDDEN, 'You are not authorized');
    }

    // Add decoded user to request
    (req as any).user = decoded;
    next();
  });
};

export default auth;
