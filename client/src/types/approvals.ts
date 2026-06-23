export type ApprovalStatus = "Pending" | "Approved" | "Rejected";

export type SignatureSlot = {
  role: "Applicant" | "Supervisor" | "Director" | "FA";
  signedBy: string;
  signedAt: string;
  signed: boolean;
};

export type ApprovalTransaction = {
  id: number;
  date: string;
  department: string;
  unit: string;
  item: string;
  description: string;
  payOut: number;
  VAT: number;
  withoutVAT: number;
  deliveryFee: number;
  balance: number;
  category: string;
  employeeId: string;
  employeeName: string;
  projectNo: string;
  currency: "PHP" | "USD" | "Other";
  paymentMethod: "T/T" | "Cash";
  payeeTo: "Employee" | "Supplier";
  supplierName: string;
  withheldAmount: number;
  invoiceNote: string;
  status: ApprovalStatus;
  signatures: SignatureSlot[];
  submittedAt: string;
  remarks: string;
};