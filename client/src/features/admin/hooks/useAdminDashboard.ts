import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/features/admin/services/admin.service";

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const result = await adminService.getDashboardStats();
      return result.data;
    },
  });
};
