import crypto from 'crypto';

import bcrypt from 'bcryptjs';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';

import ApiError from '../../common/utils/ApiError.js';
import config from '../../config/index.js';
import prisma from '../../config/prisma.js';
import { EmailService } from '../email/email.service.js';

import type {
  IAuthResponse,
  IForgotPassword,
  ILoginUser,
  IRegisterUser,
  IResetPassword,
  ITokenPayload,
} from './auth.interface.js';
import { authRepository } from './auth.repository.js';

/**
 * Service layer for Authentication module.
 * Implements business logic for user registration and authentication.
 */
export class AuthService {
  /**
   * Register a new user
   * @param data - The user registration data
   * @returns User object and tokens
   */
  async register(data: IRegisterUser): Promise<{ message: string }> {
    const isUserExist = await authRepository.findByEmail(data.email);

    if (isUserExist) {
      throw new ApiError(
        httpStatus.CONFLICT,
        'User already exists with this email'
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(
      data.password,
      Number(config.bcrypt_salt_rounds)
    );

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 3600000); // 1 hour

    await authRepository.createUser({
      ...data,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpires,
    });

    // Send verification email
    const verificationLink = `${config.client_url}/verify-email?token=${verificationToken}`;

    await EmailService.sendEmail(
      'Verify Your Email',
      data.email,
      `${data.firstName} ${data.lastName}`,
      { verification_link: verificationLink, name: data.firstName },
      17
    );

    return {
      message:
        'Registration successful! Please check your email to verify your account.',
    };
  }

  /**
   * Authenticate a user and generate tokens
   * @param data - User credentials
   * @returns User object and tokens
   */
  async login(data: ILoginUser): Promise<IAuthResponse> {
    const user = await authRepository.findByEmail(data.email);

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    // Check if verified
    if (!user.isVerified) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        'Please verify your email before logging in.'
      );
    }

    // Verify password
    const isPasswordMatched = await bcrypt.compare(
      data.password,
      user.password
    );

    if (!isPasswordMatched) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
    }

    // Generate tokens
    const { accessToken, refreshToken } = this.generateTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Store refresh token in DB
    const expiresAt = new Date();
    expiresAt.setDate(
      expiresAt.getDate() +
        (parseInt(config.jwt_refresh_expires_in as string) || 30)
    );

    await authRepository.upsertRefreshToken(user.id, refreshToken, expiresAt);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  /**
   * Verify user email using token
   * @param token - Verification token
   */
  async verifyEmail(token: string) {
    const user = await authRepository.findByVerificationToken(token);

    if (!user) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Invalid or expired verification token'
      );
    }

    await authRepository.updateUser(user.id, {
      isVerified: true,
      verificationToken: null,
      verificationTokenExpires: null,
    });

    return { message: 'Email verified successfully! You can now log in.' };
  }

  /**
   * Resend verification email
   * @param email - User email
   */
  async resendVerification(email: string) {
    const user = await authRepository.findByEmail(email);

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    if (user.isVerified) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email is already verified');
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 3600000); // 1 hour

    await authRepository.updateUser(user.id, {
      verificationToken,
      verificationTokenExpires,
    });

    const verificationLink = `${config.client_url}/verify-email?token=${verificationToken}`;

    await EmailService.sendEmail(
      'Verify Your Email',
      user.email,
      `${user.firstName} ${user.lastName}`,
      { verification_link: verificationLink, name: user.firstName },
      17
    );

    return { message: 'Verification email resent successfully.' };
  }

  /**
   * Initiate password reset flow
   * @param data - User email
   */
  async forgotPassword(data: IForgotPassword) {
    const user = await authRepository.findByEmail(data.email);

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 900000); // 15 minutes

    await authRepository.updateUser(user.id, {
      resetToken,
      resetTokenExpires,
    });

    const resetLink = `${config.client_url}/reset-password?token=${resetToken}`;

    await EmailService.sendEmail(
      'Reset Your Password',
      user.email,
      `${user.firstName} ${user.lastName}`,
      { reset_link: resetLink, name: user.firstName },
      18
    );

    return { message: 'Password reset link sent to your email.' };
  }

  /**
   * Reset password using token
   * @param data - Token and new password
   */
  async resetPassword(data: IResetPassword) {
    const user = await authRepository.findByResetToken(data.token);

    if (!user) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Invalid or expired reset token'
      );
    }

    const hashedPassword = await bcrypt.hash(
      data.password,
      Number(config.bcrypt_salt_rounds)
    );

    await authRepository.updateUser(user.id, {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpires: null,
    });

    return { message: 'Password reset successful! You can now log in.' };
  }

  /**
   * Refresh access token using a valid refresh token
   * @param token - Old refresh token
   */
  async refreshToken(token: string) {
    // 1. Verify token
    try {
      jwt.verify(token, config.jwt_refresh_secret as string);
    } catch {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid refresh token');
    }

    // 2. Check if token exists in DB
    const storedToken = await authRepository.findRefreshToken(token);
    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        'Refresh token expired or revoked'
      );
    }

    // 3. Generate new pair
    const { accessToken, refreshToken: newRefreshToken } = this.generateTokens({
      id: storedToken.user.id,
      email: storedToken.user.email,
      role: storedToken.user.role,
    });

    // 4. Update DB (Token Rotation)
    await authRepository.deleteRefreshToken(token);

    const expiresAt = new Date();
    expiresAt.setDate(
      expiresAt.getDate() +
        (parseInt(config.jwt_refresh_expires_in as string) || 30)
    );

    await authRepository.upsertRefreshToken(
      storedToken.userId,
      newRefreshToken,
      expiresAt
    );

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  /**
   * Logout user by removing refresh token
   * @param token - The refresh token to invalidate
   */
  async logout(token: string) {
    const storedToken = await authRepository.findRefreshToken(token);
    if (storedToken) {
      await authRepository.deleteRefreshToken(token);
    }
  }

  /**
   * Get current authenticated user details
   * @param userId - The user ID from decoded token
   */
  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    return user;
  }

  /**
   * Helper to generate access and refresh tokens
   * @param payload - Data to encode in the tokens
   * @returns Generated tokens
   */
  private generateTokens(payload: ITokenPayload) {
    const accessToken = jwt.sign(payload, config.jwt_access_secret as string, {
      expiresIn: config.jwt_access_expires_in as NonNullable<
        SignOptions['expiresIn']
      >,
    });

    const refreshToken = jwt.sign(
      payload,
      config.jwt_refresh_secret as string,
      {
        expiresIn: config.jwt_refresh_expires_in as NonNullable<
          SignOptions['expiresIn']
        >,
      }
    );

    return { accessToken, refreshToken };
  }
}

export const authService = new AuthService();
