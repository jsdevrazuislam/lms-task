import { useQuery } from "@tanstack/react-query";
import { progressApi } from "@/features/enrollment/progress.api";
import { useAppSelector } from "@/store";

export const useEnrollmentStats = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return useQuery({
    queryKey: ["student-stats"],
    queryFn: () => progressApi.getStats(),
    enabled: isAuthenticated,
  });
};
