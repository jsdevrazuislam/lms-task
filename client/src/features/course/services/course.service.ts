import apiClient from "@/lib/apiClient";

export enum CourseStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}

export interface CourseFilters {
  searchTerm?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number | string;
  level?: string;
  categoryId?: string;
  status?: CourseStatus;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
import {
  ICourse,
  CoursesResponse,
  CourseResponse,
  CreateCoursePayload,
} from "../types";

/**
 * Service object for all course-related API operations.
 * Handles fetching, creating, updating, and enrolling in courses.
 */
export const courseService = {
  /**
   * Retrieves a paginated list of courses based on optional filters.
   *
   * @param params - Filtering, sorting, and pagination parameters
   * @returns A promise resolving to a paginated CoursesResponse
   */
  async getCourses(params?: CourseFilters): Promise<CoursesResponse> {
    const response = await apiClient.get("/courses", { params });
    return response.data;
  },

  /**
   * Retrieves a single course by its unique ID.
   *
   * @param id - The course ID
   * @returns A promise resolving to a single CourseResponse
   */
  async getCourse(id: string): Promise<CourseResponse> {
    const response = await apiClient.get(`/courses/${id}`);
    return response.data;
  },

  /**
   * Creates a new course.
   *
   * @param data - The structured payload for course creation
   * @returns A promise resolving to the created CourseResponse
   */
  async createCourse(data: CreateCoursePayload): Promise<CourseResponse> {
    const response = await apiClient.post("/courses", data);
    return response.data;
  },

  async updateCourse(
    id: string,
    data: Partial<ICourse>,
  ): Promise<CourseResponse> {
    const response = await apiClient.patch(`/courses/${id}`, data);
    return response.data;
  },

  async getPopularCourses(): Promise<{ data: ICourse[] }> {
    const response = await apiClient.get("/courses/popular");
    return response.data;
  },
  async getRecommendedCourses(): Promise<{ data: ICourse[] }> {
    const response = await apiClient.get("/courses/recommended");
    return response.data;
  },
  async deleteCourse(id: string): Promise<void> {
    await apiClient.delete(`/courses/${id}`);
  },
  async getCategories(): Promise<{
    success: boolean;
    data: { id: string; name: string }[];
  }> {
    const response = await apiClient.get("/categories");
    return response.data;
  },
  async enroll(id: string): Promise<void> {
    await apiClient.post(`/courses/${id}/enroll`);
  },
  async getUploadSignature(params?: {
    folder?: string;
    resource_type?: string;
  }): Promise<{
    success: boolean;
    data: {
      signature: string;
      timestamp: number;
      cloudName: string;
      apiKey: string;
      eager?: string;
    };
  }> {
    const response = await apiClient.get("/upload/signature", { params });
    return response.data;
  },
  async getVideoTicket(
    courseId: string,
    lessonId: string,
  ): Promise<{
    success: boolean;
    data: {
      url: string;
    };
  }> {
    const response = await apiClient.get(
      `/courses/${courseId}/lessons/${lessonId}/video-ticket`,
    );
    return response.data;
  },
};
