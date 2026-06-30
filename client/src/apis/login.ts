import api from "./api";
import type { LoginRequest, LoginResponse } from "../types/login";

export const loginUser = async (
  payload: LoginRequest
): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>("login/", payload);
    const data = response.data;
    // Save token (adjust based on your backend)
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    if (data.access) {
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh || "");
    }
    return data;
  } catch (error: any) {
    throw error.response?.data || { message: "Login failed" };
  }
};