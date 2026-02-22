import { EnrollmentStatus } from '@prisma/client';
import httpStatus from 'http-status';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import ApiError from '../../common/utils/ApiError.js';
import { courseRepository } from '../course/course.repository.js';
import { NotificationService } from '../notification/notification.service.js';

import { enrollmentRepository } from './enrollment.repository.js';
import { EnrollmentService } from './enrollment.service.js';

vi.mock('./enrollment.repository.js');
vi.mock('../course/course.repository.js');
vi.mock('../notification/notification.service.js');
vi.mock('../../config/prisma.js', () => ({
  default: {
    enrollment: {
      update: vi.fn(),
      findUnique: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
    },
  },
}));

describe('EnrollmentService', () => {
  const mockStudentId = 'student-1';
  const mockCourseId = 'course-1';
  const mockCourse = { id: mockCourseId, title: 'Test Course' };
  const mockEnrollment = {
    id: 'enr-1',
    studentId: mockStudentId,
    courseId: mockCourseId,
    status: EnrollmentStatus.ACTIVE,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('enrollInCourse', () => {
    it('should enroll a student successfully and trigger a notification', async () => {
      vi.mocked(courseRepository.findById).mockResolvedValue(
        mockCourse as unknown as Awaited<
          ReturnType<typeof courseRepository.findById>
        >
      );
      const { default: prisma } = await import('../../config/prisma.js');
      vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: mockStudentId,
        email: 'student@test.com',
      } as unknown as Awaited<ReturnType<typeof prisma.user.findUnique>>);
      vi.mocked(enrollmentRepository.create).mockResolvedValue({
        ...mockEnrollment,
        course: mockCourse,
      } as unknown as Awaited<ReturnType<typeof enrollmentRepository.create>>);

      const result = await EnrollmentService.enrollInCourse(
        mockStudentId,
        mockCourseId
      );

      expect(result.id).toBe('enr-1');
      expect(NotificationService.createNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: mockStudentId,
          title: 'Course Enrollment',
        })
      );
    });

    it('should throw NOT_FOUND if course does not exist', async () => {
      vi.mocked(courseRepository.findById).mockResolvedValue(null);

      await expect(
        EnrollmentService.enrollInCourse(mockStudentId, mockCourseId)
      ).rejects.toThrow(new ApiError(httpStatus.NOT_FOUND, 'Course not found'));
    });

    it('should throw BAD_REQUEST if student is already enrolled', async () => {
      vi.mocked(courseRepository.findById).mockResolvedValue(
        mockCourse as unknown as Awaited<
          ReturnType<typeof courseRepository.findById>
        >
      );
      vi.mocked(enrollmentRepository.findUnique).mockResolvedValue(
        mockEnrollment as unknown as Awaited<
          ReturnType<typeof enrollmentRepository.findUnique>
        >
      );

      await expect(
        EnrollmentService.enrollInCourse(mockStudentId, mockCourseId)
      ).rejects.toThrow(
        new ApiError(httpStatus.BAD_REQUEST, 'Already enrolled in this course')
      );
    });
  });

  describe('dropCourse', () => {
    it('should drop a course successfully and trigger a notification', async () => {
      // Mocking enrollmentRepository.findMany through the service's internal call
      vi.mocked(enrollmentRepository.findMany).mockResolvedValue([
        mockEnrollment,
      ] as unknown as Awaited<
        ReturnType<typeof enrollmentRepository.findMany>
      >);

      const { default: prisma } = await import('../../config/prisma.js');
      vi.mocked(prisma.enrollment.update).mockResolvedValue({
        ...mockEnrollment,
        status: EnrollmentStatus.DROPPED,
      } as unknown as Awaited<ReturnType<typeof prisma.enrollment.update>>);

      const result = await EnrollmentService.dropCourse(
        mockStudentId,
        mockCourseId
      );

      expect(result.status).toBe(EnrollmentStatus.DROPPED);
      expect(NotificationService.createNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: mockStudentId,
          title: 'Course Dropped',
        })
      );
    });

    it('should throw NOT_FOUND if enrollment does not exist', async () => {
      vi.mocked(enrollmentRepository.findMany).mockResolvedValue(
        [] as unknown as Awaited<
          ReturnType<typeof enrollmentRepository.findMany>
        >
      );

      await expect(
        EnrollmentService.dropCourse(mockStudentId, mockCourseId)
      ).rejects.toThrow(
        new ApiError(httpStatus.NOT_FOUND, 'Enrollment not found')
      );
    });
  });
});
