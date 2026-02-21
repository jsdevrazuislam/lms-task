import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  authService,
  AuthResponse,
  LoginCredentials,
  RegisterData,
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
  const { user, isAuthenticated, isLoading, error } = useAppSelector(
    (state) => state.auth,
  );

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
    },
  });

  const registerMutation = useMutation({
    mutationFn: (userData: RegisterData) => authService.register(userData),
    onSuccess: (response: AuthResponse) => {
      dispatch(setCredentials(response.data));
      handleRedirect(response.data.user.role);
    },
    onError: (err: Error) => {
      dispatch(setError(err.message));
    },
  });

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      dispatch(logoutAction());
      queryClient.clear();
      router.push("/login");
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    logout,
  };
};
