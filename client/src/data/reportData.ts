import type { Transaction } from "../types/reports";

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 1, date: "2026-06-01", description: "Office Supplies", amount: 500,  category: "Supplies" },
  { id: 2, date: "2026-06-03", description: "Snacks",          amount: 300,  category: "Food"     },
  { id: 3, date: "2026-06-05", description: "Transport",       amount: 200,  category: "Travel"   },
  { id: 4, date: "2026-06-10", description: "Printer Ink",     amount: 700,  category: "Supplies" },
];

export const MONTHLY_BUDGET = 15000;

export const CATEGORY_COLORS: string[] = [
  "bg-[#00355f]",
  "bg-[#743b00]",
  "bg-[#e0e3e5]",
  "bg-[#0f4c81]",
];