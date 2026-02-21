import apiClient from "@/lib/apiClient";
import { IUser } from "../types";

export interface AuthResponse {
  success: boolean;
  data: {
    user: IUser;
    token: string;
  };
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
};
