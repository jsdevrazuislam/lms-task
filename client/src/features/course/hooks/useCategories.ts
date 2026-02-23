import { useQuery } from "@tanstack/react-query";
import { courseService } from "../services/course.service";

export const useCategories = (options?: {
  initialData?: { success: boolean; data: { id: string; name: string }[] };
}) => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => courseService.getCategories(),
    select: (data) => data.data,
    ...options,
  });
};
