import apiClient from "@/lib/apiClient";

export interface StudentStats {
  totalEnrolled: number;
  completedCourses: number;
  activeCourses: number;
  overallProgress: number;
  enrollmentDetails: EnrollmentDetails[];
}

export interface EnrollmentDetails {
  courseId: string;
  title: string;
  progress: number;
  thumbnail: string;
  enrolledAt: string;
  completedAt: string;
  totalLessons: number;
  completedLessons: number;
  courseTitle: string;
  status: string;
  instructor: string;
  lastActive: string;
}

export interface ProgressResponse {
  success: boolean;
  message: string;
  data: {
    totalLessons: number;
    completedLessons: number;
    percentage: number;
    completedLessonIds: string[];
  };
}

export const enrollmentApi = {
  getEnrollmentStatus: async (
    courseId: string,
  ): Promise<{ success: boolean; data: { isEnrolled: boolean } }> => {
    const response = await apiClient.get(`/enrollments/status/${courseId}`);
    return response.data;
  },
  getStudentEnrollments: async (): Promise<{
    success: boolean;
    data: unknown[];
  }> => {
    const response = await apiClient.get("/enrollments/my-courses");
    return response.data;
  },
  getCertificates: async (): Promise<{ success: boolean; data: unknown[] }> => {
    const response = await apiClient.get("/enrollments/certificates");
    return response.data;
  },
};

export const progressApi = {
  getStats: async (): Promise<{ success: boolean; data: StudentStats }> => {
    const response = await apiClient.get("/enrollments/stats");
    return response.data;
  },
  getCourseProgress: async (courseId: string): Promise<ProgressResponse> => {
    const response = await apiClient.get(`/student/courses/${courseId}`);
    return response.data;
  },
  toggleLessonCompletion: async (
    lessonId: string,
  ): Promise<{ success: boolean }> => {
    const response = await apiClient.patch(
      `/student/lessons/${lessonId}/toggle`,
    );
    return response.data;
  },
};
