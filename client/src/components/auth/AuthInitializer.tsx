"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { authService } from "@/features/auth/services/auth.service";
import {
  setCredentials,
  setLoading,
  setError,
  logout,
  setInitialized,
} from "@/features/auth/store/authSlice";
import { tokenUtils } from "@/features/auth/utils/token.utils";
import { useAppDispatch } from "@/store";

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const token = tokenUtils.getToken();

  const {
    data: user,
    error,
    isFetched,
  } = useQuery({
    queryKey: ["me"],
    queryFn: authService.getMe,
    enabled: !!token,
    retry: false,
  });

  useEffect(() => {
    // If no token exists, initialization is technically "complete" as a guest
    if (!token) {
      dispatch(setLoading(false));
      dispatch(setInitialized(true));
      return;
    }

    // Handle successful hydration
    if (user?.data) {
      dispatch(
        setCredentials({
          user: user.data,
          accessToken: tokenUtils.getToken() || (token as string),
          remember: tokenUtils.shouldRemember(),
        }),
      );
      dispatch(setLoading(false));
      dispatch(setInitialized(true));
      return;
    }

    // Handle hydration error or completion of fetch with no user
    if (error || (isFetched && !user)) {
      const storedToken = tokenUtils.getToken();
      if (!storedToken) {
        dispatch(logout());
        if (error) dispatch(setError("Session expired. Please log in again."));
      }
      dispatch(setLoading(false));
      dispatch(setInitialized(true));
    }
  }, [user, error, isFetched, token, dispatch]);

  return <>{children}</>;
}
