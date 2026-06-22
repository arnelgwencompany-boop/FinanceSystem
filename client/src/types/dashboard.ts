export type DashboardTransaction = {
  id: number;
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
  status: "Completed" | "Pending";
};

export type DashboardSummary = {
  income: string;
  expenses: string;
  balance: string;
};

export type DeptSpend = {
  label: string;
  amount: string;
  pct: number;
};