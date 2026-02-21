import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { progressApi } from "@/features/enrollment/progress.api";

export const useLessonProgress = (courseId: string) => {
  return useQuery({
    queryKey: ["course-progress", courseId],
    queryFn: () => progressApi.getCourseProgress(courseId),
    enabled: !!courseId,
  });
};

export const useToggleLessonCompletion = (courseId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (lessonId: string) =>
      progressApi.toggleLessonCompletion(lessonId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["course-progress", courseId],
      });
      queryClient.invalidateQueries({ queryKey: ["student-stats"] });
    },
    onError: (error: { response: { data: { message: string } } }) => {
      toast.error(
        error?.response?.data?.message || "Failed to update progress",
      );
    },
  });
};
