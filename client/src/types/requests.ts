// The full transaction shape (from TransactionsPage)
// ── Petty Cash Request (admin view) ─────────────────────────────────────────
export type RequestStatus = "Pending" | "Approved" | "Rejected";

export interface PettyCashRequest {
  id: number;
  requestNo: string;
  requestedBy: string;
  department: string;
  date: string;
  description: string;
  amount: number;
  VAT: number;
  withoutVAT: number;
  deliveryFee: number;
  status: RequestStatus;
}

// ── Legacy Transaction (kept for PrintableForm compatibility) ─────────────────
export interface Transaction {
  id: number;
  department: string;
  unit: string;
  item: string;
  date: string;
  description: string;
  payOut: number;
  VAT: number;
  withoutVAT: number;
  deliveryFee: number;
  balance: number;
  status: string;
}

// What's submitted into the payment request form
export type PaymentRequestForm = {
  employeeId: string;
  employeeName: string;
  ext: string;
  department: string;
  projectNo: string;
  dueDate: string;
  currency: "PHP" | "USD" | "Other";
  paymentMethod: "T/T" | "Cash";
  payeeTo: "Employee" | "Supplier";
  supplierName: string;
  withheldAmount: number;
  withheldNote: string;
  invoiceNote: string;
};

export const EMPTY_FORM: PaymentRequestForm = {
  employeeId: "",
  employeeName: "",
  ext: "",
  department: "",
  projectNo: "",
  dueDate: "",
  currency: "PHP",
  paymentMethod: "T/T",
  payeeTo: "Employee",
  supplierName: "",
  withheldAmount: 0,
  withheldNote: "",
  invoiceNote: "",
};