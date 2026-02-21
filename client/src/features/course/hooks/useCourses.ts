import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { courseService, CourseFilters } from "../services/course.service";
import { ICourse } from "../types";

export const useCourses = (params?: CourseFilters) => {
  return useQuery({
    queryKey: ["courses", params],
    queryFn: () => courseService.getCourses(params),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
};

export const useCourse = (id: string, enabled = true) => {
  return useQuery({
    queryKey: ["course", id],
    queryFn: () => courseService.getCourse(id),
    enabled: !!id && enabled,
  });
};

export const useCourseMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: courseService.createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ICourse> }) =>
      courseService.updateCourse(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["course", variables.id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: courseService.deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });

  return {
    createCourse: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateCourse: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteCourse: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
};
