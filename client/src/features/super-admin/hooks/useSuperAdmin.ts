import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { AdminCreationValues, PlatformSettingsValues } from "../schemas";
import {
  superAdminService,
  ISuperAdminAnalytics,
} from "../services/superAdmin.service";

export const useSuperAdminStats = () => {
  return useQuery({
    queryKey: ["super-admin", "stats"],
    queryFn: () => superAdminService.getPlatformStats(),
  });
};

export const useSuperAdminRevenueTrend = () => {
  return useQuery({
    queryKey: ["super-admin", "revenue-trend"],
    queryFn: () => superAdminService.getRevenueTrend(),
  });
};

export const useSuperAdminAnalytics = () => {
  return useQuery<ISuperAdminAnalytics>({
    queryKey: ["super-admin", "analytics"],
    queryFn: () => superAdminService.getAnalytics(),
  });
};

export const useSuperAdminSettings = () => {
  return useQuery({
    queryKey: ["super-admin", "settings"],
    queryFn: () => superAdminService.getSettings(),
  });
};

export const useSuperAdminAdmins = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["super-admin", "admins", page, limit],
    queryFn: () => superAdminService.getAllAdmins(page, limit),
  });
};

export const useSuperAdminUsers = (params?: {
  role?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ["super-admin", "users", params],
    queryFn: () => superAdminService.getAllUsers(params),
  });
};

export const useSuperAdminCourses = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["super-admin", "courses", page, limit],
    queryFn: () => superAdminService.getAllCourses(page, limit),
  });
};

export const useCreateAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: AdminCreationValues) =>
      superAdminService.createAdmin(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["super-admin", "admins"] });
      toast({
        title: "Success",
        description: "Admin created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create admin",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: Partial<AdminCreationValues>;
    }) => superAdminService.updateAdmin(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["super-admin", "admins"] });
      toast({
        title: "Success",
        description: "Admin updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update admin",
        variant: "destructive",
      });
    },
  });
};

export const useOverrideCourseStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      superAdminService.overrideCourseStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["super-admin", "courses"] });
      queryClient.invalidateQueries({ queryKey: ["super-admin", "stats"] });
      queryClient.invalidateQueries({ queryKey: ["super-admin", "analytics"] });
      toast({
        title: "Success",
        description: "Course status updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update course status",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateSettings = () => {
  return useMutation({
    mutationFn: (body: PlatformSettingsValues) =>
      superAdminService.updateSettings(body),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Platform settings updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update settings",
        variant: "destructive",
      });
    },
  });
};

export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      superAdminService.toggleUserStatus(id, isActive),
    onSuccess: (_, { isActive }) => {
      queryClient.invalidateQueries({ queryKey: ["super-admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["super-admin", "admins"] });
      toast({
        title: "Success",
        description: `User ${isActive ? "activated" : "deactivated"} successfully`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update user status",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => superAdminService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["super-admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["super-admin", "admins"] });
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      });
    },
  });
};
