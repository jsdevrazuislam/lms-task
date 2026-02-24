"use client";

import { useRouter } from "@bprogress/next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { courseService } from "@/features/course/services/course.service";
import { useAppSelector } from "@/store";

export const useEnrollment = (courseId: string) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const enrollmentMutation = useMutation({
    mutationFn: () => courseService.enroll(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-courses"] });
      toast.success("Successfully enrolled in course!");
      router.push(`/dashboard/student`); // Or to the course player
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to enroll in course");
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
