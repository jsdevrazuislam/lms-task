import { useQuery } from "@tanstack/react-query";
import { instructorService } from "../services/instructor.service";

export const useInstructorStats = () => {
  return useQuery({
    queryKey: ["instructor", "stats"],
    queryFn: () => instructorService.getStats(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useInstructorCourses = () => {
  return useQuery({
    queryKey: ["instructor", "courses"],
    queryFn: () => instructorService.getCourses(),
    staleTime: 1000 * 60 * 5,
  });
};

export const useInstructorStudents = () => {
  return useQuery({
    queryKey: ["instructor", "students"],
    queryFn: () => instructorService.getStudents(),
    staleTime: 1000 * 60 * 5,
  });
};
