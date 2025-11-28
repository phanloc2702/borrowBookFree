// src/services/authService.ts
import axiosClient from "../utils/axiosClient";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  data: {
    authenticated: boolean;
    token: string;
  };
  errorCode?: string | null;
}

export const authService = {
  login: async (payload: LoginRequest): Promise<{ authenticated: boolean; token: string }> => {
    try {
      const response = await axiosClient.post<LoginResponse>("/auth/login", payload);
      return response.data.data; 
    } catch (error: any) {
      if (error.response && error.response.data) {
        const { message, errorCode } = error.response.data;
        throw new Error(message || errorCode || "Đăng nhập thất bại");
      }
      throw new Error("Không thể kết nối đến server");
    }
  },
};
