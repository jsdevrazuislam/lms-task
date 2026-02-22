import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  setNotifications,
  markAsRead as markAsReadAction,
  markAllAsRead as markAllAsReadAction,
  removeNotification as removeNotificationAction,
} from "@/store/slices/notificationSlice";
import { notificationService } from "../services/notification.service";

export const useNotifications = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const { notifications, unreadCount } = useAppSelector(
    (state) => state.notifications,
  );

  const {
    data: fetchedNotifications,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => notificationService.getNotifications(),
    // We sync to Redux in useEffect
  });

  useEffect(() => {
    if (fetchedNotifications) {
      dispatch(setNotifications(fetchedNotifications));
    }
  }, [fetchedNotifications, dispatch]);

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: (_, id) => {
      dispatch(markAsReadAction(id));
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (err: unknown) => {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to mark as read";
      toast.error(errorMessage);
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      dispatch(markAllAsReadAction());
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("All notifications marked as read");
    },
    onError: (err: unknown) => {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to mark all as read";
      toast.error(errorMessage);
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: (id: string) => notificationService.deleteNotification(id),
    onSuccess: (_, id) => {
      dispatch(removeNotificationAction(id));
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (err: unknown) => {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to delete notification";
      toast.error(errorMessage);
    },
  });

  return {
    notifications,
    unreadCount,
    isLoading,
    isError,
    error,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    deleteNotification: deleteNotificationMutation.mutate,
  };
};
