import apiClient from "@/lib/apiClient";

export type UserRole = "SUPER_ADMIN" | "ADMIN" | "INSTRUCTOR" | "STUDENT";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserFilters {
  searchTerm?: string;
  role?: UserRole;
  page?: number;
  limit?: number;
}

export interface PaginatedUsers {
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: User[];
}

export const userService = {
  getAllUsers: async (params?: UserFilters) => {
    const response = await apiClient.get<PaginatedUsers>("/users", { params });
    return response.data;
  },
  updateUserRole: async (id: string, role: UserRole) => {
    const response = await apiClient.patch<{ data: User }>(
      `/users/${id}/role`,
      { role },
    );
    return response.data;
  },
  deleteUser: async (id: string) => {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  },
  toggleUserStatus: async (id: string, isActive: boolean) => {
    const response = await apiClient.patch<{ data: User }>(
      `/users/${id}/status`,
      { isActive },
    );
    return response.data;
  },
};
