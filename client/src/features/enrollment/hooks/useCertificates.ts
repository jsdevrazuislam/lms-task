import { useQuery } from "@tanstack/react-query";
import { enrollmentApi } from "@/features/enrollment/enrollment.api";
import { useAppSelector } from "@/store";

export const useCertificates = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return useQuery({
    queryKey: ["student-certificates"],
    queryFn: () => enrollmentApi.getCertificates(),
    enabled: isAuthenticated,
  });
};
