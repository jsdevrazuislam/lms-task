import { useQuery } from "@tanstack/react-query";
import { enrollmentApi } from "@/features/enrollment/enrollment.api";
import { useAppSelector } from "@/store";

export const useStudentEnrollments = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return useQuery({
    queryKey: ["student-enrollments"],
    queryFn: () => enrollmentApi.getStudentEnrollments(),
    enabled: isAuthenticated,
  });
};
