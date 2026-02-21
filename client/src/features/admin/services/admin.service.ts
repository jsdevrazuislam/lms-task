import apiClient from "@/lib/apiClient";

export interface AdminStats {
  kpis: {
    activeStudents: number;
    instructors: number;
    totalCourses: number;
    totalRevenue: number;
  };
  enrollmentTrend: {
    date: string;
    students: number;
  }[];
  revenueSummary: {
    month: string;
    revenue: number;
  }[];
  topCourses: {
    title: string;
    instructor: string;
    enrollments: number;
  }[];
}

export const adminService = {
  getDashboardStats: async () => {
    const response = await apiClient.get<{ data: AdminStats }>("/admin/stats");
    return response.data;
  },
};
