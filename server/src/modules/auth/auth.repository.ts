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
}

export const authRepository = new AuthRepository();
