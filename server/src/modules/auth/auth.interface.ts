import type { User, UserRole } from '@prisma/client';
import type { JwtPayload } from 'jsonwebtoken';

import type { TUserRole } from '../../common/constants/roles.js';

/**
 * Interface for user registration request data
 */
export type IRegisterUser = Pick<
  User,
  'email' | 'password' | 'firstName' | 'lastName' | 'role'
>;

/**
 * Internal interface for creating a user with security tokens
 */
export interface ICreateUser extends IRegisterUser {
  role: UserRole;
  verificationToken?: string | null;
  verificationTokenExpires?: Date | null;
}

/**
 * Interface for user login request data
 */
export type ILoginUser = Pick<User, 'email' | 'password'>;

/**
 * Interface for the auth response containing user info and tokens
 */
export interface IAuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    role: TUserRole;
    firstName: string;
    lastName: string;
  };
}

/**
 * Payload for JWT tokens
 */
export interface ITokenPayload extends JwtPayload {
  id: string;
  email: string;
  role: TUserRole;
}

/**
 * Response for refresh token logic
 */
export interface IRefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

/**
 * Forgot password request data
 */
export interface IForgotPassword {
  email: string;
}

/**
 * Reset password request data
 */
export interface IResetPassword {
  token: string;
  password: string;
}
