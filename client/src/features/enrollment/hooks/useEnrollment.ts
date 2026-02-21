"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { enrollmentApi } from "@/features/enrollment/enrollment.api";
import { useAppSelector } from "@/store";

export const useEnrollment = (courseId: string) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const enrollmentMutation = useMutation({
    mutationFn: () => enrollmentApi.enrollInCourse(courseId),
    onSuccess: (_, courseId) => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
      queryClient.invalidateQueries({ queryKey: ["student-courses"] });
      queryClient.invalidateQueries({ queryKey: ["student-stats"] });
      queryClient.invalidateQueries({ queryKey: ["user-courses"] });
      toast.success("Successfully enrolled in the course!");
      router.push(`/dashboard/student/courses`);
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      const message =
        error.response?.data?.message || "Failed to enroll in course";
      toast.error(message);
    },
  });

  const enroll = async () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/courses/${courseId}`);
      return;
    }

    if (user?.role !== "STUDENT") {
      toast.error("Only students can enroll in courses");
      return;
    }

    enrollmentMutation.mutate();
  };

  return {
    enroll,
    isEnrolling: enrollmentMutation.isPending,
  };
};
