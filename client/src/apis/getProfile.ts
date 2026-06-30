import api from "./api";
import type { UserProfile } from "../types/myProfile";

export const getProfile = async (): Promise<UserProfile> => {
  try {
    const response = await api.get<UserProfile>("my-profile/");
    return response.data;
  } catch (error: any) {
    console.error("Profile error:", error.response?.data || error.message);
    throw error;
  }
};