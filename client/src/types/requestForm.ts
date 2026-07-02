export type Currency      = "PHP" | "USD" | "Other";
export type PaymentMethod = "CASH" | "T/T";
export type PayeeType     = "EMPLOYEE" | "SUPPLIER";

export interface RequestFormData {
  employee_id?:    string;
  department?:     string;
  ext?:            string;
  project_no:     string;
  date:           string;
  due_date:       string;
  description:    string;
  currency:       Currency;
  amount:         string;
  vat:            string;
  without_vat:    string;
  delivery_fee:   string;
  payment_method: PaymentMethod;
  payee_type:     PayeeType;
  payee_name:     string;
  note:           string;
}

export const EMPTY: RequestFormData = {
  employee_id: "", department: "", ext: "", project_no: "",
  date: new Date().toISOString().slice(0,10), due_date: "",
  description: "", currency: "PHP", amount: "", vat: "",
  without_vat: "", delivery_fee: "", payment_method: "CASH",
  payee_type: "EMPLOYEE", payee_name: "", note: "",
};

export const sym = (c: Currency) => c === "PHP" ? "₱" : c === "USD" ? "$" : "";
export const money = (v: string | number) => {
  const n = typeof v === "string" ? parseFloat(v) || 0 : v;
  return n.toLocaleString("en-PH", { minimumFractionDigits: 2 });
};