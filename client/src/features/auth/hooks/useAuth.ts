import { useRouter } from "@bprogress/next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  authService,
  AuthResponse,
  LoginCredentials,
  RegisterData,
  ResetPasswordData,
} from "../services/auth.service";
import {
  setCredentials,
  logout as logoutAction,
  setError,
} from "../store/authSlice";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isAuthenticated, isLoading, isInitialized, error } =
    useAppSelector((state) => state.auth);

  const handleRedirect = (role: string) => {
    const params = new URLSearchParams(window.location.search);
    const redirectPath = params.get("redirect");

    if (redirectPath) {
      router.push(redirectPath);
      return;
    }

    switch (role) {
      case "SUPER_ADMIN":
        router.push("/dashboard/super-admin");
        break;
      case "ADMIN":
        router.push("/dashboard/admin");
        break;
      case "INSTRUCTOR":
        router.push("/dashboard/instructor");
        break;
      case "STUDENT":
        router.push("/dashboard/student");
        break;
      default:
        router.push("/dashboard");
    }
  };

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials & { remember?: boolean }) =>
      authService.login(credentials),
    onSuccess: (response: AuthResponse, variables) => {
      dispatch(
        setCredentials({
          ...response.data,
          remember: !!variables.remember,
        }),
      );
      handleRedirect(response.data.user.role);
    },
    onError: (err: Error) => {
      dispatch(setError(err.message));
      setTimeout(() => {
        dispatch({ type: "auth/clearError" });
      }, 8000);
    },
  });

  const registerMutation = useMutation({
    mutationFn: (userData: RegisterData) => authService.register(userData),
    onSuccess: () => {
      // Registration successful, but needs verification
      router.push("/login?verify=check");
    },
    onError: (err: Error) => {
      dispatch(setError(err.message));
      setTimeout(() => {
        dispatch({ type: "auth/clearError" });
      }, 8000);
    },
  });

  const verifyEmailMutation = useMutation({
    mutationFn: (token: string) => authService.verifyEmail(token),
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (data: ResetPasswordData) => authService.resetPassword(data),
  });

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      dispatch(logoutAction());
      queryClient.clear();
      router.push("/");
    }
  };

  const setErrorWithTimeout = (message: string, duration = 8000) => {
    dispatch(setError(message));
    setTimeout(() => {
      dispatch({ type: "auth/clearError" });
    }, duration);
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
    error,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    verifyEmail: verifyEmailMutation.mutateAsync,
    isVerifying: verifyEmailMutation.isPending,
    forgotPassword: forgotPasswordMutation.mutateAsync,
    isSendingReset: forgotPasswordMutation.isPending,
    resetPassword: resetPasswordMutation.mutateAsync,
    isResetting: resetPasswordMutation.isPending,
    logout,
    setError: setErrorWithTimeout,
  };
};
