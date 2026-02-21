"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
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
import { useAppDispatch, useAppSelector } from "@/store";

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { isInitialized } = useAppSelector((state) => state.auth);
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
    if (user) {
      dispatch(
        setCredentials({
          user: user.data,
          token: tokenUtils.getToken() || token,
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

  const isRehydrating = !!token && !isInitialized;

  // PREVENT RENDER: If we have a token but haven't initialized/rehydrated yet,
  // we must block children to prevent premature API calls from protected components.
  if (isRehydrating) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          Securing your session...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
