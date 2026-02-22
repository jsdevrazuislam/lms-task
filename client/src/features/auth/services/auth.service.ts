import apiClient from "@/lib/apiClient";
import { IUser } from "../types";

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: IUser;
    accessToken: string;
  };
}

export interface GenericResponse {
  success: boolean;
  message: string;
  data: null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  company?: string;
  role?: string;
}

export interface ResetPasswordData {
  token: string;
  password?: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post("/auth/login", credentials);
    return response.data;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post("/auth/register", data);
    return response.data;
  },

  async logout(): Promise<void> {
    await apiClient.post("/auth/logout");
  },

  async getMe(): Promise<{ success: boolean; data: IUser }> {
    const response = await apiClient.get("/auth/me");
    return response.data;
  },

  async refreshToken(): Promise<{
    success: boolean;
    data: { accessToken: string };
  }> {
    const response = await apiClient.post("/auth/refresh-token");
    return response.data;
  },

  async verifyEmail(token: string): Promise<GenericResponse> {
    const response = await apiClient.get(`/auth/verify-email?token=${token}`);
    return response.data;
  },

  async forgotPassword(email: string): Promise<GenericResponse> {
    const response = await apiClient.post("/auth/forgot-password", { email });
    return response.data;
  },

  async resetPassword(data: ResetPasswordData): Promise<GenericResponse> {
    const response = await apiClient.post("/auth/reset-password", data);
    return response.data;
  },
};
