import { CourseStatus } from '@prisma/client';

export interface ICreateCourse {
  title: string;
  description?: string;
  thumbnail?: string;
  price: number;
  categoryId: string;
  status?: CourseStatus;
}

export type IUpdateCourse = Partial<ICreateCourse>;

export interface ICourseFilterRequest {
  searchTerm?: string;
  minPrice?: string;
  maxPrice?: string;
  categoryId?: string;
  status?: CourseStatus;
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
