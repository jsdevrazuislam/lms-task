import type { User } from '@prisma/client';

/**
 * Interface for user registration request data
 */
export type IRegisterUser = Pick<
  User,
  'email' | 'password' | 'firstName' | 'lastName'
>;

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
    role: string;
    firstName: string;
    lastName: string;
  };
}

/**
 * Payload for JWT tokens
 */
export interface ITokenPayload {
  id: string;
  email: string;
  role: string;
}

/**
 * Response for refresh token logic
 */
export interface IRefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}
