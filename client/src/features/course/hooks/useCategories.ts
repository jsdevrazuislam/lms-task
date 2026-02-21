import { useQuery } from "@tanstack/react-query";
import { courseService } from "../services/course.service";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => courseService.getCategories(),
    select: (data) => data.data,
  });
};
