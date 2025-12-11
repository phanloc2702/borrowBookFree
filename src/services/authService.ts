// src/services/authService.ts
import axiosClient from "../utils/axiosClient";

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  username: string;
  fullName: string;
  email: string;
  password: string;
}

// payload đổi mật khẩu
export interface ChangePasswordPayload {
  email: string;
  oldPassword: string;
  newPassword: string;
}

// user nhận từ backend
export interface AuthUser {
  id: number;
  fullName: string;
  email: string;
  role: "USER" | "ADMIN";
}

interface AuthApiResponse {
  message: string;
  data: {
    authenticated: boolean;
    token: string;
    user: AuthUser;
  };
  errorCode?: string | null;
}

interface ApiResponse<T = any> {
  message: string;
  data: T;
  errorCode?: string | null;
}

export const authService = {
  // LOGIN
  login: async (
    payload: LoginRequest
  ): Promise<{ authenticated: boolean; token: string; user: AuthUser }> => {
    try {
      const response = await axiosClient.post<AuthApiResponse>(
        "/auth/login",
        payload
      );
      return response.data.data; // { authenticated, token, user }
    } catch (error: any) {
      if (error.response && error.response.data) {
        const { message, errorCode } = error.response.data;
        throw new Error(message || errorCode || "Đăng nhập thất bại");
      }
      throw new Error("Không thể kết nối đến server");
    }
  },

  // REGISTER
  register: async (
    payload: RegisterRequest
  ): Promise<{ authenticated: boolean; token: string; user: AuthUser }> => {
    try {
      const response = await axiosClient.post<AuthApiResponse>(
        "/auth/register",
        payload
      );
      return response.data.data; // { authenticated, token, user }
    } catch (error: any) {
      if (error.response && error.response.data) {
        const { message, errorCode } = error.response.data;
        throw new Error(message || errorCode || "Đăng ký thất bại");
      }
      throw new Error("Không thể kết nối đến server");
    }
  },

  // CHANGE PASSWORD
  changePassword: async (payload: ChangePasswordPayload): Promise<void> => {
    try {
      // BE: POST /auth/change-password với body { email, oldPassword, newPassword }
      const response = await axiosClient.post<ApiResponse>(
        "/auth/change-password",
        payload
      );

      // Nếu muốn, bạn có thể return response.data để lấy message:
      // return response.data;
      // Ở đây để đơn giản, chỉ cần void, FE dùng toast theo message từ BE (nếu muốn).
    } catch (error: any) {
      if (error.response && error.response.data) {
        const { message, errorCode } = error.response.data;
        throw new Error(message || errorCode || "Đổi mật khẩu thất bại");
      }
      throw new Error("Không thể kết nối đến server");
    }
  },
};
