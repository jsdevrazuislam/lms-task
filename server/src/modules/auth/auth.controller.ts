import type { Request, Response } from 'express';
import httpStatus from 'http-status';

import catchAsync from '../../common/utils/catchAsync.js';
import sendResponse from '../../common/utils/sendResponse.js';
import config from '../../config/index.js';

import { authService } from './auth.service.js';

/**
 * Controller class for Authentication module.
 * Bridges HTTP requests to the AuthService logic.
 */
export class AuthController {
  /**
   * Register a new user
   */
  register = catchAsync(async (req: Request, res: Response) => {
    const result = await authService.register(req.body);
    const { refreshToken, accessToken, user } = result;

    // Set refresh token in cookie
    res.cookie('refreshToken', refreshToken, {
      secure: config.NODE_ENV === 'production',
      httpOnly: true,
    });

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'User registered successfully',
      data: {
        accessToken,
        user,
      },
    });
  });

  /**
   * User login
   */
  login = catchAsync(async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    const { refreshToken, accessToken, user } = result;

    // Set refresh token in cookie
    res.cookie('refreshToken', refreshToken, {
      secure: config.NODE_ENV === 'production',
      httpOnly: true,
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User logged in successfully',
      data: {
        accessToken,
        user,
      },
    });
  });
}

export const authController = new AuthController();
