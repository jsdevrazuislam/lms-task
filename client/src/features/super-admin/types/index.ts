import { UserRole } from "@/features/auth/types";

export interface IPlatformStats {
  totalUsers: number;
  students: number;
  instructors: number;
  admins: number;
  activeCourses: number;
  totalRevenue: number;
}

export interface IRevenueTrend {
  month: string;
  revenue: number;
}

export interface ISuperAdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

export interface ISuperAdminCourse {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  instructor: {
    firstName: string;
    lastName: string;
  };
  _count: {
    enrollments: number;
  };
}

export interface IPaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
export interface IPlatformSettings {
  commissionPercentage: number;
  contactEmail: string;
  supportEmail: string;
  globalBannerText?: string;
  isMaintenanceMode: boolean;
}
