import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  courseService,
  CourseFilters,
  CourseStatus,
} from "@/features/course/services/course.service";
import { toast } from "@/hooks/use-toast";

export const useAdminCourses = (
  initialFilters: CourseFilters = { page: 1, limit: 10 },
) => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<CourseFilters>(initialFilters);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-courses", filters],
    queryFn: () => courseService.getCourses(filters),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: CourseStatus }) =>
      courseService.updateCourse(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
      toast({
        title: "Success",
        description: "Course status updated successfully",
      });
    },
    onError: (err: Error) => {
      toast({
        title: "Error",
        description: err.message || "Failed to update course status",
        variant: "destructive",
      });
    },
  });

  const deleteCourseMutation = useMutation({
    mutationFn: courseService.deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
      toast({
        title: "Success",
        description: "Course deleted successfully",
      });
    },
    onError: (err: Error) => {
      toast({
        title: "Error",
        description: err.message || "Failed to delete course",
        variant: "destructive",
      });
    },
  });

  return {
    courses: data?.data || [],
    meta: data?.meta || { page: 1, limit: 10, total: 0 },
    isLoading,
    error: error instanceof Error ? error.message : null,
    filters,
    setFilters,
    handleUpdateStatus: (id: string, status: CourseStatus) =>
      updateStatusMutation.mutateAsync({ id, status }),
    handleDeleteCourse: (id: string) => deleteCourseMutation.mutateAsync(id),
    refetch: () =>
      queryClient.invalidateQueries({ queryKey: ["admin-courses"] }),
  };
};
