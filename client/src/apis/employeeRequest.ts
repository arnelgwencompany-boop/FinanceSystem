import api from "./api";
import type { RequestFormData } from "../types/requestForm";

export const createRequest = async (payload: RequestFormData) => {
  try {
    const response = await api.post("create-requests/", payload);
    return response.data;
  } catch (error: any) {
    console.error("CreateRequest Error:", error.response?.data);

    throw error.response?.data || {
      message: "Request creation failed",
    };
  }
};

export const getRequests = async () => {
  try {
    const response = await api.get("requests/");
    return response.data;
  } catch (error: any) {
    console.error("Get Requests Error:", error.response?.data);
    throw error.response?.data || { message: "Failed to fetch requests" };
  }
};