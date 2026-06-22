import type { DashboardSummary, DashboardTransaction, DeptSpend } from "../../types/dashboard";
import DashboardHeader from "../../components/dashboard/Dashboardheader";
import SummaryCards from "../../components/dashboard/Summarycards";
import LatestTransactions from "../../components/dashboard/Latesttransactions";
import SpendingChart from "../../components/dashboard/Spendingchart";

// ─── Static mock data ────────────────────────────────────────────────────────

const summary: DashboardSummary = {
  income: "100,000.00",
  expenses: "42,415.00",
  balance: "57,585.00",
};

const transactions: DashboardTransaction[] = [
  {
    id: 1,
    department: "LA",
    unit: "0",
    item: "1",
    date: "1/21/2024",
    description: "Headphone set",
    payOut: "2248.9",
    VAT: "242.4",
    withoutVAT: "2602.5",
    deliveryFee: "394",
    balance: "91251.10",
    status: "Completed",
  },
  {
    id: 2,
    department: "LO",
    unit: "0",
    item: "2",
    date: "1/13/2026",
    description: "Humidity Temperature (2 pcs)",
    payOut: "216.5",
    VAT: "0",
    withoutVAT: "138",
    deliveryFee: "58.5",
    balance: "90014.6",
    status: "Completed",
  },
];

const deptSpend: DeptSpend[] = [
  { label: "GA", amount: "42,800", pct: 85 },
  { label: "GO", amount: "18,400", pct: 45 },
  { label: "IE", amount: "12,100", pct: 32 },
];

// ─────────────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <div className="font-sans text-[#191c1e] bg-[#F8FAFC] min-h-screen flex">
      <main className="ml-[240px] pt-24 px-8 pb-8 w-full">

        <DashboardHeader />

        <SummaryCards
          summary={summary}
          activityCount={24}
          pendingCount={3}
        />

        <LatestTransactions transactions={transactions} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
          <SpendingChart data={deptSpend} period="Last 30 Days" />
        </div>

      </main>
    </div>
  );
}