import bcrypt from 'bcryptjs';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';

import ApiError from '../../common/utils/ApiError.js';
import config from '../../config/index.js';
import prisma from '../../config/prisma.js';

import type {
  IAuthResponse,
  ILoginUser,
  IRegisterUser,
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
  async register(data: IRegisterUser): Promise<IAuthResponse> {
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

    const newUser = await authRepository.createUser({
      ...data,
      password: hashedPassword,
    });

    // Generate tokens
    const { accessToken, refreshToken } = this.generateTokens({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    // Store refresh token in DB
    const expiresAt = new Date();
    expiresAt.setDate(
      expiresAt.getDate() + parseInt(config.jwt_refresh_expires_in as string) ||
        30
    );

    await authRepository.upsertRefreshToken(
      newUser.id,
      refreshToken,
      expiresAt
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
      },
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
      expiresIn: config.jwt_access_expires_in as any,
    });

    const refreshToken = jwt.sign(
      payload,
      config.jwt_refresh_secret as string,
      {
        expiresIn: config.jwt_refresh_expires_in as any,
      }
    );

    return { accessToken, refreshToken };
  }
}

export const authService = new AuthService();
