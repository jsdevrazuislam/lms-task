import apiClient from "@/lib/apiClient";
import { AdminCreationValues, PlatformSettingsValues } from "../schemas";
import {
  IPlatformStats,
  IRevenueTrend,
  ISuperAdminUser,
  ISuperAdminCourse,
  IPaginatedResponse,
  IPlatformSettings,
} from "../types";

export interface ISuperAdminAnalytics {
  topCourses: {
    id: string;
    title: string;
    instructor: string;
    enrollments: number;
    revenue: number;
  }[];
  userGrowth: {
    month: string;
    total: number;
    students: number;
    instructors: number;
  }[];
  categoryDistribution: {
    name: string;
    revenue: number;
  }[];
  enrollmentGrowth: {
    date: string;
    count: number;
  }[];
}

export const superAdminService = {
  getPlatformStats: async () => {
    const response = await apiClient.get<{ data: IPlatformStats }>(
      "/super-admin/stats",
    );
    return response.data.data;
  },

  getRevenueTrend: async () => {
    const response = await apiClient.get<{ data: IRevenueTrend[] }>(
      "/super-admin/revenue-trend",
    );
    return response.data.data;
  },

  getAnalytics: async () => {
    const response = await apiClient.get<{ data: ISuperAdminAnalytics }>(
      "/super-admin/analytics",
    );
    return response.data.data;
  },

  getAllAdmins: async (page = 1, limit = 10) => {
    const response = await apiClient.get<{
      data: IPaginatedResponse<ISuperAdminUser>;
    }>("/super-admin/admins", {
      params: { page, limit },
    });
    return response.data.data;
  },

  getAllUsers: async (params?: {
    role?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await apiClient.get<{
      data: IPaginatedResponse<ISuperAdminUser>;
    }>("/super-admin/users", {
      params,
    });
    return response.data.data;
  },

  getAllCourses: async (page = 1, limit = 10) => {
    const response = await apiClient.get<{
      data: IPaginatedResponse<ISuperAdminCourse>;
    }>("/super-admin/courses", {
      params: { page, limit },
    });
    return response.data.data;
  },

  createAdmin: async (body: AdminCreationValues) => {
    const response = await apiClient.post<{ data: ISuperAdminUser }>(
      "/super-admin/admins",
      body,
    );
    return response.data.data;
  },

  updateAdmin: async (id: string, body: Partial<AdminCreationValues>) => {
    const response = await apiClient.patch<{ data: ISuperAdminUser }>(
      `/super-admin/admins/${id}`,
      body,
    );
    return response.data.data;
  },

  overrideCourseStatus: async (id: string, status: string) => {
    const response = await apiClient.patch<{ data: unknown }>(
      `/super-admin/courses/${id}/status`,
      { status },
    );
    return response.data.data;
  },

  updateSettings: async (body: PlatformSettingsValues) => {
    const response = await apiClient.patch<{ data: unknown }>(
      "/super-admin/settings",
      body,
    );
    return response.data.data;
  },

  getSettings: async () => {
    const response = await apiClient.get<{ data: IPlatformSettings }>(
      "/super-admin/settings",
    );
    return response.data.data;
  },

  toggleUserStatus: async (id: string, isActive: boolean) => {
    const response = await apiClient.patch<{ data: ISuperAdminUser }>(
      `/super-admin/users/${id}/status`,
      { isActive },
    );
    return response.data.data;
  },

  deleteUser: async (id: string) => {
    const response = await apiClient.delete<{ data: null }>(
      `/super-admin/users/${id}`,
    );
    return response.data.data;
  },
};
