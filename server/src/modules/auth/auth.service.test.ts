import type { User, RefreshToken } from '@prisma/client';
import bcrypt from 'bcryptjs';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';

import ApiError from '../../common/utils/ApiError.js';
import prisma from '../../config/prisma.js';
import { EmailService } from '../email/email.service.js';

import type { ITokenPayload } from './auth.interface.js';
import { authRepository } from './auth.repository.js';
import { AuthService } from './auth.service.js';

vi.mock('./auth.repository.js', () => ({
  authRepository: {
    findByEmail: vi.fn(),
    createUser: vi.fn(),
    upsertRefreshToken: vi.fn(),
    findRefreshToken: vi.fn(),
    deleteRefreshToken: vi.fn(),
    findByVerificationToken: vi.fn(),
    findByResetToken: vi.fn(),
    updateUser: vi.fn(),
  },
}));

vi.mock('../email/email.service.js', () => ({
  EmailService: {
    sendEmail: vi.fn(),
  },
}));

vi.mock('../../config/prisma.js', () => ({
  default: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock('jsonwebtoken', () => ({
  default: {
    sign: vi.fn(),
    verify: vi.fn(),
  },
}));

vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}));

const mockedAuthRepository = vi.mocked(authRepository);
const mockedBcrypt = vi.mocked(bcrypt);
const mockedJwt = vi.mocked(jwt);

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    vi.clearAllMocks();
    authService = new AuthService();
  });

  describe('register', () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
    };

    it('should register a new user successfully', async () => {
      mockedAuthRepository.findByEmail.mockResolvedValue(null);
      mockedBcrypt.hash.mockResolvedValue('hashed_password' as never);
      mockedAuthRepository.createUser.mockResolvedValue({
        id: '1',
        ...userData,
        password: 'hashed_password',
        role: 'STUDENT',
        isVerified: false,
        isActive: true,
        verificationToken: 'token',
        verificationTokenExpires: new Date(),
        resetToken: null,
        resetTokenExpires: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      mockedJwt.sign.mockReturnValue('token' as never);

      const result = await authService.register(userData);

      expect(result.message).toContain('Registration successful');
      expect(mockedAuthRepository.createUser).toHaveBeenCalled();
      expect(EmailService.sendEmail).toHaveBeenCalled();
    });

    it('should throw error if user already exists', async () => {
      mockedAuthRepository.findByEmail.mockResolvedValue({ id: '1' } as User);

      await expect(authService.register(userData)).rejects.toThrow(
        new ApiError(httpStatus.CONFLICT, 'User already exists with this email')
      );
    });
  });

  describe('login', () => {
    const loginData = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should login successfully with correct credentials', async () => {
      const user = {
        id: '1',
        email: loginData.email,
        password: 'hashed_password',
        role: 'STUDENT' as const,
        firstName: 'John',
        lastName: 'Doe',
        isVerified: true,
        verificationToken: null,
        verificationTokenExpires: null,
        resetToken: null,
        resetTokenExpires: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockedAuthRepository.findByEmail.mockResolvedValue(user as User);
      mockedBcrypt.compare.mockResolvedValue(true as never);
      mockedJwt.sign.mockReturnValue('token' as never);

      const result = await authService.login(loginData);

      expect(result.accessToken).toBe('token');
      expect(result.user.id).toBe(user.id);
      expect(mockedAuthRepository.upsertRefreshToken).toHaveBeenCalled();
    });

    it('should throw error if user not found', async () => {
      mockedAuthRepository.findByEmail.mockResolvedValue(null);

      await expect(authService.login(loginData)).rejects.toThrow(
        new ApiError(httpStatus.NOT_FOUND, 'User not found')
      );
    });

    it('should throw error with incorrect password', async () => {
      mockedAuthRepository.findByEmail.mockResolvedValue({
        password: 'hashed',
        isVerified: true,
      } as User);
      mockedBcrypt.compare.mockResolvedValue(false as never);

      await expect(authService.login(loginData)).rejects.toThrow(
        new ApiError(httpStatus.UNAUTHORIZED, 'Invalid credentials')
      );
    });
  });

  describe('logout', () => {
    it('should delete refresh token if it exists', async () => {
      const mockToken = 'valid-token';
      mockedAuthRepository.findRefreshToken.mockResolvedValue({
        token: mockToken,
      } as RefreshToken & { user: User });

      await authService.logout(mockToken);

      expect(mockedAuthRepository.deleteRefreshToken).toHaveBeenCalledWith(
        mockToken
      );
    });

    it('should do nothing if token does not exist', async () => {
      mockedAuthRepository.findRefreshToken.mockResolvedValue(null);

      await authService.logout('invalid');

      expect(mockedAuthRepository.deleteRefreshToken).not.toHaveBeenCalled();
    });
  });

  describe('refreshToken', () => {
    it('should rotate tokens successfully', async () => {
      const oldToken = 'old-token';
      const storedToken = {
        token: oldToken,
        userId: 'user-1',
        expiresAt: new Date(Date.now() + 10000),
        user: {
          id: 'user-1',
          email: 'test@test.com',
          role: 'STUDENT',
          firstName: 'Test',
          lastName: 'User',
          isVerified: true,
          verificationToken: null,
          verificationTokenExpires: null,
          resetToken: null,
          resetTokenExpires: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      (mockedJwt.verify as Mock).mockReturnValue({
        id: 'user-1',
      } as ITokenPayload);
      mockedAuthRepository.findRefreshToken.mockResolvedValue(
        storedToken as RefreshToken & { user: User }
      );
      mockedJwt.sign.mockReturnValue('new-token' as never);

      const result = await authService.refreshToken(oldToken);

      expect(mockedAuthRepository.deleteRefreshToken).toHaveBeenCalledWith(
        oldToken
      );
      expect(mockedAuthRepository.upsertRefreshToken).toHaveBeenCalled();
      expect(result.accessToken).toBe('new-token');
    });

    it('should throw error if refresh token is invalid', async () => {
      mockedJwt.verify.mockImplementation(() => {
        throw new Error();
      });

      await expect(authService.refreshToken('bad-token')).rejects.toThrow(
        new ApiError(httpStatus.UNAUTHORIZED, 'Invalid refresh token')
      );
    });

    it('should throw error if token not in DB', async () => {
      (mockedJwt.verify as Mock).mockReturnValue({
        id: 'user-1',
      } as ITokenPayload);
      mockedAuthRepository.findRefreshToken.mockResolvedValue(null);

      await expect(authService.refreshToken('gone-token')).rejects.toThrow(
        new ApiError(
          httpStatus.UNAUTHORIZED,
          'Refresh token expired or revoked'
        )
      );
    });

    it('should throw error if token is expired in DB', async () => {
      (mockedJwt.verify as Mock).mockReturnValue({
        id: 'user-1',
      } as ITokenPayload);
      const expiredToken = { expiresAt: new Date(Date.now() - 1000) };
      mockedAuthRepository.findRefreshToken.mockResolvedValue(
        expiredToken as RefreshToken & { user: User }
      );

      await expect(authService.refreshToken('expired-token')).rejects.toThrow(
        new ApiError(
          httpStatus.UNAUTHORIZED,
          'Refresh token expired or revoked'
        )
      );
    });
  });

  describe('getMe', () => {
    it('should return user profile successfully', async () => {
      const user = {
        id: '1',
        email: 'a@b.com',
        firstName: 'A',
        lastName: 'B',
        role: 'STUDENT',
        isVerified: true,
        verificationToken: null,
        verificationTokenExpires: null,
        resetToken: null,
        resetTokenExpires: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      (
        prisma.user.findUnique as unknown as {
          mockResolvedValue: (v: User | null) => void;
        }
      ).mockResolvedValue(user as User);

      const result = await authService.getMe('1');

      expect(result).not.toHaveProperty('password');
      expect(result.email).toBe('a@b.com');
    });

    it('should throw error if user does not exist', async () => {
      (
        prisma.user.findUnique as unknown as {
          mockResolvedValue: (v: User | null) => void;
        }
      ).mockResolvedValue(null);

      await expect(authService.getMe('none')).rejects.toThrow(
        new ApiError(httpStatus.NOT_FOUND, 'User not found')
      );
    });
  });
});
