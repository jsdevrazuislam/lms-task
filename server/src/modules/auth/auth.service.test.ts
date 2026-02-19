import bcrypt from 'bcryptjs';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import ApiError from '../../common/utils/ApiError.js';
import prisma from '../../config/prisma.js';

import { authRepository } from './auth.repository.js';
import { AuthService } from './auth.service.js';

vi.mock('./auth.repository.js', () => ({
  authRepository: {
    findByEmail: vi.fn(),
    createUser: vi.fn(),
    upsertRefreshToken: vi.fn(),
    findRefreshToken: vi.fn(),
    deleteRefreshToken: vi.fn(),
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
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      mockedJwt.sign.mockReturnValue('token' as never);

      const result = await authService.register(userData);

      expect(result.user.email).toBe(userData.email);
      expect(result.accessToken).toBe('token');
      expect(mockedAuthRepository.createUser).toHaveBeenCalled();
      expect(mockedAuthRepository.upsertRefreshToken).toHaveBeenCalled();
    });

    it('should throw error if user already exists', async () => {
      mockedAuthRepository.findByEmail.mockResolvedValue({ id: '1' } as any);

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
      };

      mockedAuthRepository.findByEmail.mockResolvedValue(user as any);
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
      } as any);
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
      } as any);

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
        user: { id: 'user-1', email: 'test@test.com', role: 'STUDENT' },
      };

      mockedJwt.verify.mockReturnValue({ id: 'user-1' } as any);
      mockedAuthRepository.findRefreshToken.mockResolvedValue(
        storedToken as any
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
      mockedJwt.verify.mockReturnValue({ id: 'user-1' } as any);
      mockedAuthRepository.findRefreshToken.mockResolvedValue(null);

      await expect(authService.refreshToken('gone-token')).rejects.toThrow(
        new ApiError(
          httpStatus.UNAUTHORIZED,
          'Refresh token expired or revoked'
        )
      );
    });

    it('should throw error if token is expired in DB', async () => {
      mockedJwt.verify.mockReturnValue({ id: 'user-1' } as any);
      const expiredToken = { expiresAt: new Date(Date.now() - 1000) };
      mockedAuthRepository.findRefreshToken.mockResolvedValue(
        expiredToken as any
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
        password: 'secret',
      };
      (prisma.user.findUnique as any).mockResolvedValue(user);

      const result = await authService.getMe('1');

      expect(result).not.toHaveProperty('password');
      expect(result.email).toBe('a@b.com');
    });

    it('should throw error if user does not exist', async () => {
      (prisma.user.findUnique as any).mockResolvedValue(null);

      await expect(authService.getMe('none')).rejects.toThrow(
        new ApiError(httpStatus.NOT_FOUND, 'User not found')
      );
    });
  });
});
