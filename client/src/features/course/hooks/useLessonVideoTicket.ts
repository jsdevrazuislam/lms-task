import { useQuery } from "@tanstack/react-query";
import { courseService } from "../services/course.service";

/**
 * Hook to fetch a secure streaming ticket for a lesson video
 * @param courseId The ID of the course
 * @param lessonId The ID of the lesson
 * @returns Query object with the signed video URL
 */
export const useLessonVideoTicket = (
  courseId: string,
  lessonId: string | null,
) => {
  return useQuery({
    queryKey: ["lesson-video-ticket", courseId, lessonId],
    queryFn: async () => {
      if (!courseId || !lessonId) return null;
      const response = await courseService.getVideoTicket(courseId, lessonId);
      return response.data.url;
    },
    enabled: !!courseId && !!lessonId,
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  });
};
