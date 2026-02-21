import { useQuery } from "@tanstack/react-query";
import { courseService } from "@/features/course/services/course.service";

export const useVideoTicket = (
  courseId: string,
  lessonId: string,
  enabled = true,
) => {
  return useQuery({
    queryKey: ["video-ticket", courseId, lessonId],
    queryFn: () => courseService.getVideoTicket(courseId, lessonId),
    enabled: !!courseId && !!lessonId && enabled,
    staleTime: 1000 * 60 * 30, // Ticket valid for 30 minutes
    retry: 2,
  });
};
