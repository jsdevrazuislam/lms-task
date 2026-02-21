import apiClient from "@/lib/apiClient";

export interface IInstructorDashboardStats {
  totalStudents: number;
  avgRating: number;
  totalRevenue: number;
  totalCourses: number;
  revenueTrend: { name: string; revenue: number }[];
  dailyTrend: { name: string; revenue: number }[];
}

export interface IInstructorCourseStats {
  id: string;
  title: string;
  thumbnail: string | null;
  price: number;
  status: string;
  enrolledStudents: number;
  revenue: number;
  rating: number;
}

export interface IInstructorStudent {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  courseTitle: string;
  progress: number;
  status: string;
  enrolledAt: string;
  lastActive: string;
}

/**
 * Service object for instructor-specific data operations.
 * Handles dashboard statistics, course lists, and student tracking for instructors.
 */
export const instructorService = {
  /**
   * Retrieves high-level dashboard statistics for the instructor.
   *
   * @returns A promise resolving to IInstructorDashboardStats
   */
  getStats: async (): Promise<IInstructorDashboardStats> => {
    const response = await apiClient.get("/instructor/dashboard/stats");
    return response.data.data;
  },

  /**
   * Retrieves all courses managed by the currently logged-in instructor.
   *
   * @returns A promise resolving to an array of IInstructorCourseStats
   */
  getCourses: async (): Promise<IInstructorCourseStats[]> => {
    const response = await apiClient.get("/instructor/courses");
    return response.data.data;
  },

  /**
   * Retrieves a list of students enrolled in the instructor's courses.
   *
   * @returns A promise resolving to an array of IInstructorStudent
   */
  getStudents: async (): Promise<IInstructorStudent[]> => {
    const response = await apiClient.get("/instructor/students");
    return response.data.data;
  },
};
