import { z } from 'zod';

/**
 * Zod schema for user registration validation
 */
export const registerValidationSchema = z.object({
  body: z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters long' }),
    firstName: z.string().min(1, { message: 'First name is required' }),
    lastName: z.string().min(1, { message: 'Last name is required' }),
    role: z.enum(['STUDENT', 'INSTRUCTOR'], {
      message: 'Role must be either STUDENT or INSTRUCTOR',
    }),
  }),
});

/**
 * Zod schema for user login validation
 */
export const loginValidationSchema = z.object({
  body: z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(1, { message: 'Password is required' }),
  }),
});

/**
 * Zod schema for refresh token validation
 */
export const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      message: 'Refresh token must be a string',
    }),
  }),
});

/**
 * Zod schema for email verification validation
 */
export const verifyEmailValidationSchema = z.object({
  query: z.object({
    token: z.string().min(1, { message: 'Verification token is required' }),
  }),
});

/**
 * Zod schema for forgot password validation
 */
export const forgotPasswordValidationSchema = z.object({
  body: z.object({
    email: z.string().email({ message: 'Invalid email address' }),
  }),
});

/**
 * Zod schema for reset password validation
 */
export const resetPasswordValidationSchema = z.object({
  body: z.object({
    token: z.string().min(1, { message: 'Reset token is required' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters long' }),
  }),
});

export const AuthValidation = {
  registerValidationSchema,
  loginValidationSchema,
  refreshTokenValidationSchema,
  verifyEmailValidationSchema,
  forgotPasswordValidationSchema,
  resetPasswordValidationSchema,
};
