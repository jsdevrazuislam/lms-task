import { useQuery } from "@tanstack/react-query";
import { enrollmentApi } from "@/features/enrollment/progress.api";
import { useAppSelector } from "@/store";

export const useCheckEnrollment = (courseId: string) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return useQuery({
    queryKey: ["enrollment-status", courseId],
    queryFn: () => enrollmentApi.getEnrollmentStatus(courseId),
    enabled: !!courseId && isAuthenticated,
  });
};
