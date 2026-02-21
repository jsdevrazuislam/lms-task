"use client";

import { useQuery } from "@tanstack/react-query";
import { courseService } from "@/features/course/services/course.service";

export const useRecommendedCourses = () => {
  return useQuery({
    queryKey: ["courses", "recommended"],
    queryFn: () => courseService.getRecommendedCourses(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
