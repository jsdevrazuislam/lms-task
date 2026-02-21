import type { User } from '@prisma/client';

import prisma from '../../config/prisma.js';

import type { IRegisterUser } from './auth.interface.js';

/**
 * Repository layer for Authentication module.
 * Handles direct database interactions with the User model.
 */
export class AuthRepository {
  /**
   * Find a user by their email address
   * @param email - The email to search for
   * @returns The user object if found, otherwise null
   */
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  /**
   * Create a new user in the database
   * @param data - The user registration data
   * @returns The newly created user object
   */
  async createUser(data: IRegisterUser): Promise<User> {
    return prisma.user.create({
      data,
    });
  }

  /**
   * Create or update a refresh token for a user
   * @param userId - The user ID
   * @param token - The refresh token
   * @param expiresAt - Expiration date
   */
  async upsertRefreshToken(userId: string, token: string, expiresAt: Date) {
    return prisma.refreshToken.upsert({
      where: { token },
      update: { token, expiresAt },
      create: { userId, token, expiresAt },
    });
  }

  /**
   * Find a refresh token in the database
   * @param token - The refresh token to search for
   */
  async findRefreshToken(token: string) {
    return prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });
  }

  /**
   * Delete a refresh token (Logout)
   * @param token - The token to delete
   */
  async deleteRefreshToken(token: string) {
    return prisma.refreshToken.delete({
      where: { token },
    });
  }
}

export const authRepository = new AuthRepository();
