import { UserRole } from '@prisma/client';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import cloudinary from '../../config/cloudinary.js';

import { courseRepository } from './course.repository.js';
import { courseService } from './course.service.js';

vi.mock('./course.repository.js');
vi.mock('../../config/cloudinary.js');

describe('CourseService', () => {
  describe('getVideoTicket', () => {
    const mockUser = { id: 'user-1', role: UserRole.STUDENT };
    const mockCourse = {
      id: 'course-1',
      instructorId: 'instructor-1',
      modules: [
        {
          id: 'module-1',
          lessons: [
            {
              id: 'lesson-1',
              title: 'Lesson 1',
              videoUrl:
                'https://res.cloudinary.com/demo/video/upload/v1/sample.mp4',
              isFree: false,
            },
            {
              id: 'lesson-free',
              title: 'Free Lesson',
              videoUrl:
                'https://res.cloudinary.com/demo/video/upload/v1/sample.mp4',
              isFree: true,
            },
          ],
        },
      ],
    };

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should generate a signed URL for an enrolled student', async () => {
      vi.mocked(courseRepository.findById).mockResolvedValue(mockCourse as any);
      vi.mocked(courseRepository.isEnrolled).mockResolvedValue(true);
      vi.mocked(cloudinary.url).mockReturnValue('https://signed-url.m3u8');

      const result = await courseService.getVideoTicket(
        'course-1',
        'lesson-1',
        mockUser
      );

      expect(result.url).toBe('https://signed-url.m3u8');
      expect(cloudinary.url).toHaveBeenCalledWith(
        'sample',
        expect.objectContaining({
          format: 'm3u8',
          sign_url: true,
        })
      );
    });

    it('should allow access to a free lesson for non-enrolled students', async () => {
      vi.mocked(courseRepository.findById).mockResolvedValue(mockCourse as any);
      vi.mocked(courseRepository.isEnrolled).mockResolvedValue(false);
      vi.mocked(cloudinary.url).mockReturnValue('https://signed-url.m3u8');

      const result = await courseService.getVideoTicket(
        'course-1',
        'lesson-free',
        mockUser
      );

      expect(result.url).toBe('https://signed-url.m3u8');
    });

    it('should throw error if student is not enrolled in a paid lesson', async () => {
      vi.mocked(courseRepository.findById).mockResolvedValue(mockCourse as any);
      vi.mocked(courseRepository.isEnrolled).mockResolvedValue(false);

      await expect(
        courseService.getVideoTicket('course-1', 'lesson-1', mockUser)
      ).rejects.toThrow('You must be enrolled to view this content');
    });

    it('should throw error if lesson has no videoUrl', async () => {
      const courseNoVideo = {
        ...mockCourse,
        modules: [
          {
            lessons: [
              { id: 'lesson-no-video', title: 'No Video', isFree: true },
            ],
          },
        ],
      };
      vi.mocked(courseRepository.findById).mockResolvedValue(
        courseNoVideo as any
      );
      vi.mocked(courseRepository.isEnrolled).mockResolvedValue(true);

      await expect(
        courseService.getVideoTicket('course-1', 'lesson-no-video', mockUser)
      ).rejects.toThrow('Lesson has no video content');
    });
  });

  describe('getCourseById Transformation', () => {
    it('should include contentType in curriculum items', async () => {
      const fullCourse = {
        id: 'course-1',
        status: 'PUBLISHED',
        modules: [
          {
            id: 'module-1',
            title: 'Module 1',
            lessons: [
              {
                id: 'l1',
                title: 'L1',
                order: 1,
                isFree: true,
                contentType: 'video',
              },
              {
                id: 'l2',
                title: 'L2',
                order: 2,
                isFree: false,
                contentType: 'text',
              },
            ],
          },
        ],
        _count: { enrollments: 10 },
      };
      vi.mocked(courseRepository.findById).mockResolvedValue(fullCourse as any);

      const result = await courseService.getCourseById('course-1', undefined);

      const curriculumItems = result.curriculum[0].items;
      expect(curriculumItems[0]).toMatchObject({
        title: 'L1',
        contentType: 'video',
      });
      expect(curriculumItems[1]).toMatchObject({
        title: 'L2',
        contentType: 'text',
      });
    });
  });
});
