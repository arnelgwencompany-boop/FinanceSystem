export type FilterStatus = "all" | "pending" | "approved" | "rejected";

export interface Approval {
  id: number;
  role: string;
  status: "pending" | "approved" | "rejected";
  signed_by_name: string | null;
}

export interface Request {
  id: number;
  request_no: string;
  description: string;
  date: string;
  amount: string;
  currency: string;
  department: string;
  status: "pending" | "approved" | "rejected";
  approvals: Approval[];
}