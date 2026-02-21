import { CourseStatus } from '@prisma/client';

export interface ILesson {
  title: string;
  content?: string;
  videoUrl?: string;
  duration?: string;
  isFree?: boolean;
  contentType?: 'video' | 'text' | 'quiz';
  order: number;
}

export interface IModule {
  id?: string;
  title: string;
  order: number;
  duration?: string;
  lessons: ILesson[];
}

export interface ICreateCourse {
  title: string;
  subtitle?: string;
  description?: string;
  thumbnail?: string;
  price: number;
  originalPrice?: number;
  duration?: string;
  categoryId: string;
  tags?: string[];
  whatYouLearn?: string[];
  requirements?: string[];
  level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  rating?: number;
  metaDescription?: string;
  status?: CourseStatus;
  modules?: IModule[];
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
  level?: string;
  rating?: string;
}
