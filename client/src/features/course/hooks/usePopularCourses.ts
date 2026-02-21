"use client";

import { useQuery } from "@tanstack/react-query";
import { courseService } from "@/features/course/services/course.service";

export const usePopularCourses = () => {
  return useQuery({
    queryKey: ["courses", "popular"],
    queryFn: () => courseService.getPopularCourses(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
