import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { authRepository } from './auth.repository.js';
import { authService } from './auth.service.js';

vi.mock('./auth.repository.js', () => ({
  authRepository: {
    findByEmail: vi.fn(),
    createUser: vi.fn(),
  },
}));
vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}));
vi.mock('jsonwebtoken', () => ({
  default: {
    sign: vi.fn(),
  },
}));

const mockedAuthRepository = vi.mocked(authRepository);
const mockedBcrypt = vi.mocked(bcrypt);
const mockedJwt = vi.mocked(jwt);

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

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
      expect(mockedAuthRepository.createUser).toHaveBeenCalledWith({
        ...userData,
        password: 'hashed_password',
      });
    });

    it('should throw error if user already exists', async () => {
      const userData = {
        email: 'existing@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      mockedAuthRepository.findByEmail.mockResolvedValue({
        id: '1',
        ...userData,
        role: 'STUDENT',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(authService.register(userData)).rejects.toThrow(
        'User already exists with this email'
      );
    });
  });

  describe('login', () => {
    it('should login successfully with correct credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const user = {
        id: '1',
        email: loginData.email,
        password: 'hashed_password',
        role: 'STUDENT' as const,
        firstName: 'John',
        lastName: 'Doe',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockedAuthRepository.findByEmail.mockResolvedValue(user);
      mockedBcrypt.compare.mockResolvedValue(true as never);
      mockedJwt.sign.mockReturnValue('token' as never);

      const result = await authService.login(loginData);

      expect(result.accessToken).toBe('token');
      expect(result.user.id).toBe(user.id);
    });

    it('should throw error with incorrect password', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      mockedAuthRepository.findByEmail.mockResolvedValue({
        id: '1',
        email: loginData.email,
        password: 'hashed_password',
        role: 'STUDENT' as const,
        firstName: 'John',
        lastName: 'Doe',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      mockedBcrypt.compare.mockResolvedValue(false as never);

      await expect(authService.login(loginData)).rejects.toThrow(
        'Invalid credentials'
      );
    });
  });
});
