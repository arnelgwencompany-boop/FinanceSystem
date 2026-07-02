import api from "./api";

//  Approve
export const approveRequest = async (
  approvalId: number,
  comment: string
) => {
  try {
    const response = await api.post(
      `approvals/${approvalId}/approve/`,
      {
        status: "approved",
        comment,
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Approve Error:", error.response?.data);
    throw error.response?.data || { message: "Approval failed" };
  }
};

//  Reject
export const rejectRequest = async (
  approvalId: number,
  comment: string
) => {
  try {
    const response = await api.post(
      `approvals/${approvalId}/reject/`,
      {
        status: "rejected", 
        comment,
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Reject Error:", error.response?.data);
    throw error.response?.data || { message: "Rejection failed" };
  }
};