import { TrendingUp, Clock, CheckCircle, Wallet } from "lucide-react";
import type { Transaction } from "../../../types/transactions";

type Props = {
  transactions: Transaction[];
  income: number;
};

export default function StatCards({ transactions, income }: Props) {
  const totalSpend = transactions.reduce((sum, t) => sum + t.payOut, 0);
  const pendingCount = transactions.filter((t) => t.status === "Pending").length;
  const currentBalance = transactions.length > 0
    ? transactions[transactions.length - 1].balance
    : 0;

  const stats = [
    {
      label: "Total Income",
      value: `₱${income.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`,
      sub: "Budget base",
      icon: <Wallet size={16} />,
      color: "text-[#07497d]",
      subColor: "text-[#07497d]",
      border: "border-l-[#07497d]",
    },
    {
      label: "Total Spend",
      value: `₱${totalSpend.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`,
      sub: "All recorded pay-outs",
      icon: <TrendingUp size={16} />,
      color: "text-[#ba1a1a]",
      subColor: "text-[#ba1a1a]",
      border: "border-l-[#ba1a1a]",
    },
    {
      label: "Pending Items",
      value: `${pendingCount} Items`,
      sub: "Awaiting approval",
      icon: <Clock size={16} />,
      color: "text-[#00355f]",
      subColor: "text-[#505f76]",
      border: "border-l-[#00355f]",
    },
    {
      label: "Latest Balance",
      value: `₱${currentBalance.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`,
      sub: "Audit status: Current",
      icon: <CheckCircle size={16} />,
      color: "text-emerald-700",
      subColor: "text-emerald-600",
      border: "border-l-emerald-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className={`bg-white border border-[#c2c7d1] border-l-4 ${s.border} rounded-xl shadow-sm p-4`}
        >
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#727780] mb-2">
            {s.label}
          </p>
          <h4 className={`text-lg font-bold leading-tight ${s.color}`}>{s.value}</h4>
          <p className={`text-[10px] flex items-center gap-1 mt-1.5 ${s.subColor}`}>
            {s.icon}
            {s.sub}
          </p>
        </div>
      ))}
    </div>
  );
}