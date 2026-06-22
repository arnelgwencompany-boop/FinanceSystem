export type Transaction = {
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
  status: "Completed" | "Pending";
};

export type TransactionFormValues = {
  department: string;
  unit: string;
  item: string;
  date: string;
  description: string;
  payOut: string;
  VAT: string;
  withoutVAT: string;
  deliveryFee: string;
  balance: string;
};

export const EMPTY_FORM: TransactionFormValues = {
  department: "",
  unit: "",
  item: "",
  date: "",
  description: "",
  payOut: "",
  VAT: "",
  withoutVAT: "",
  deliveryFee: "",
  balance: "",
};

export const DEPARTMENTS = ["IT Ops", "Marketing", "Sales", "Executive", "GA", "GO"];