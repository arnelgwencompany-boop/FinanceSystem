import api from "./api";


// get the requests for the supervisor
export const getSupervisorRequests = async () => {
  try {
    const response = await api.get("sup-requests/");
    return response.data;
  } catch (error: any) {
    console.error("Supervisor Requests Error:", error.response?.data);
    throw error.response?.data || {
      message: "Failed to fetch supervisor requests",
    };
  }
};

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