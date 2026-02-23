import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { courseService } from "@/features/course/services/course.service";
import {
  instructorService,
  type IInstructorCourseStats,
} from "../services/instructor.service";

export const useInstructorStats = () => {
  return useQuery({
    queryKey: ["instructor", "stats"],
    queryFn: () => instructorService.getStats(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useInstructorCourses = () => {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["instructor", "courses"],
    queryFn: () => instructorService.getCourses(),
    staleTime: 1000 * 60 * 5,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => courseService.deleteCourse(id),
    onMutate: async (id) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["instructor", "courses"] });

      // Snapshot the previous value
      const previousCourses = queryClient.getQueryData<
        IInstructorCourseStats[]
      >(["instructor", "courses"]);

      // Optimistically update to the new value
      if (previousCourses) {
        queryClient.setQueryData(
          ["instructor", "courses"],
          previousCourses.filter((course) => course.id !== id),
        );
      }

      return { previousCourses };
    },
    onError: (error: Error, _id, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousCourses) {
        queryClient.setQueryData(
          ["instructor", "courses"],
          context.previousCourses,
        );
      }
      toast.error(error.message || "Failed to delete course");
    },
    onSuccess: () => {
      toast.success("Course deleted successfully");
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we are in sync with the server
      queryClient.invalidateQueries({ queryKey: ["instructor", "courses"] });
    },
  });

  return {
    ...query,
    handleDelete: (id: string) => deleteMutation.mutateAsync(id),
  };
};

export const useInstructorStudents = () => {
  return useQuery({
    queryKey: ["instructor", "students"],
    queryFn: () => instructorService.getStudents(),
    staleTime: 1000 * 60 * 5,
  });
};
