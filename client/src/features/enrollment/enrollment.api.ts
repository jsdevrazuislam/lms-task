import { ICourse } from "@/features/course/types";
import apiClient from "@/lib/apiClient";

export interface IEnrollment {
  id: string;
  courseId: string;
  course: ICourse;
  progress: number;
  status: string;
  enrolledAt: string;
  completedLessons: number;
  totalLessons: number;
}

export interface EnrollmentResponse {
  success: boolean;
  message: string;
  data: ICourse[];
}

export interface EnrollmentStatusResponse {
  success: boolean;
  message: string;
  data: {
    isEnrolled: boolean;
    enrollment: IEnrollment | null;
  };
}

export interface EnrollmentStudentResponse {
  success: boolean;
  message: string;
  data: IEnrollment[];
}

export interface ICertificate {
  id: string;
  courseId: string;
  course: ICourse;
  updatedAt: string;
}

export interface CertificatesResponse {
  success: boolean;
  message: string;
  data: ICertificate[];
}

/**
 * API service for enrollment-related operations.
 * Handles course enrollment, status checking, and certificates.
 */
export const enrollmentApi = {
  /**
   * Enrolls the current user in a specific course.
   *
   * @param courseId - The ID of the course to enroll in
   * @returns A promise resolving to an EnrollmentResponse
   */
  enrollInCourse: async (courseId: string): Promise<EnrollmentResponse> => {
    const response = await apiClient.post("/enrollments", { courseId });
    return response.data;
  },

  /**
   * Checks if the current user is enrolled in a specific course and gets details.
   *
   * @param courseId - The course ID to check status for
   * @returns A promise resolving to an EnrollmentStatusResponse
   */
  getEnrollmentStatus: async (
    courseId: string,
  ): Promise<EnrollmentStatusResponse> => {
    const response = await apiClient.get(`/enrollments/status/${courseId}`);
    return response.data;
  },

  /**
   * Retrieves all courses the current user is enrolled in.
   *
   * @returns A promise resolving to an EnrollmentStudentResponse
   */
  getStudentEnrollments: async (): Promise<EnrollmentStudentResponse> => {
    const response = await apiClient.get("/enrollments/my-courses");
    return response.data;
  },

  /**
   * Retrieves all certificates earned by the current user.
   *
   * @returns A promise resolving to a CertificatesResponse
   */
  getCertificates: async (): Promise<CertificatesResponse> => {
    const response = await apiClient.get("/enrollments/certificates");
    return response.data;
  },
};
