import { UserRole } from '@prisma/client';

export interface IUserFilterRequest {
  searchTerm?: string;
  role?: UserRole;
  email?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface IUpdateUserRole {
  role: UserRole;
}
