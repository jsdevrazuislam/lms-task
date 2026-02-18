import bcrypt from 'bcryptjs';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';

import ApiError from '../../common/utils/ApiError.js';
import config from '../../config/index.js';

import type {
  IAuthResponse,
  ILoginUser,
  IRegisterUser,
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
   * Helper to generate access and refresh tokens
   * @param payload - Data to encode in the tokens
   * @returns Generated tokens
   */
  private generateTokens(payload: { id: string; email: string; role: string }) {
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
