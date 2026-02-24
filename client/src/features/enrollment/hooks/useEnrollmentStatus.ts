"use client";

import { useQuery } from "@tanstack/react-query";
import { enrollmentApi } from "@/features/enrollment/enrollment.api";
import { useAppSelector } from "@/store";

export const useEnrollmentStatus = (courseId: string) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  return useQuery({
    queryKey: ["enrollment-status", courseId],
    queryFn: () => enrollmentApi.getEnrollmentStatus(courseId),
    enabled: !!courseId && isAuthenticated && user?.role === "STUDENT",
  });
};
