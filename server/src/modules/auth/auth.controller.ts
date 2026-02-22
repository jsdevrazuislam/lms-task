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

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: result.message,
      data: null,
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

  /**
   * User logout
   */
  logout = catchAsync(async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;

    if (refreshToken) {
      await authService.logout(refreshToken);
    }

    res.clearCookie('refreshToken');

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User logged out successfully',
      data: null,
    });
  });

  /**
   * Refresh token
   */
  refreshToken = catchAsync(async (req: Request, res: Response) => {
    const { refreshToken: oldToken } = req.cookies;
    const result = await authService.refreshToken(oldToken);
    const { refreshToken: newRefreshToken, accessToken } = result;

    // Set new refresh token in cookie
    res.cookie('refreshToken', newRefreshToken, {
      secure: config.NODE_ENV === 'production',
      httpOnly: true,
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken,
      },
    });
  });

  /**
   * Get current user
   */
  getMe = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.user;
    const result = await authService.getMe(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User profile fetched successfully',
      data: result,
    });
  });

  /**
   * Verify email
   */
  verifyEmail = catchAsync(async (req: Request, res: Response) => {
    const { token } = req.query;
    const result = await authService.verifyEmail(token as string);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: result.message,
      data: null,
    });
  });

  /**
   * Forgot password
   */
  forgotPassword = catchAsync(async (req: Request, res: Response) => {
    const result = await authService.forgotPassword(req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: result.message,
      data: null,
    });
  });

  /**
   * Reset password
   */
  resetPassword = catchAsync(async (req: Request, res: Response) => {
    const result = await authService.resetPassword(req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: result.message,
      data: null,
    });
  });

  /**
   * Resend verification email
   */
  resendVerification = catchAsync(async (req: Request, res: Response) => {
    const { email } = req.body;
    const result = await authService.resendVerification(email);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: result.message,
      data: null,
    });
  });
}

export const authController = new AuthController();
