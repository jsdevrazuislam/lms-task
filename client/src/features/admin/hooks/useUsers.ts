import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  userService,
  UserFilters,
  UserRole,
} from "@/features/admin/services/user.service";
import { toast } from "@/hooks/use-toast";

export const useUsers = (
  initialFilters: UserFilters = { page: 1, limit: 10 },
) => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<UserFilters>(initialFilters);

  const { data, isLoading, error } = useQuery({
    queryKey: ["users", filters],
    queryFn: () => userService.getAllUsers(filters),
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) =>
      userService.updateUserRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Success",
        description: "User role updated successfully",
      });
    },
    onError: (err: Error) => {
      toast({
        title: "Error",
        description: err.message || "Failed to update user role",
        variant: "destructive",
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: userService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    },
    onError: (err: Error) => {
      toast({
        title: "Error",
        description: err.message || "Failed to delete user",
        variant: "destructive",
      });
    },
  });

  return {
    users: data?.data || [],
    meta: data?.meta || { page: 1, limit: 10, total: 0 },
    isLoading,
    error: error instanceof Error ? error.message : null,
    filters,
    setFilters,
    handleUpdateRole: (id: string, role: UserRole) =>
      updateRoleMutation.mutateAsync({ id, role }),
    handleDeleteUser: (id: string) => deleteUserMutation.mutateAsync(id),
    refetch: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  };
};
