import { TrendingUp, Clock } from "lucide-react";

type Props = {
  totalAmount: number;
  recordCount: number;
  budget: number;
};

export default function KpiCards({ totalAmount, recordCount, budget }: Props) {
  const avg = recordCount > 0 ? (totalAmount / recordCount).toFixed(2) : "0.00";
  const utilPct = Math.min((totalAmount / budget) * 100, 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Expenses */}
      <div className="p-4 bg-[#f2f4f6] border border-[#c2c7d1] rounded-xl shadow-sm">
        <p className="text-[11px] font-bold uppercase tracking-wide text-[#505f76] mb-1">Total Expenses</p>
        <p className="text-2xl font-bold text-[#00355f]">₱{totalAmount.toLocaleString()}</p>
        <div className="flex items-center gap-1 mt-2 text-green-700">
          <TrendingUp size={14} />
          <span className="text-[12px] font-bold">Based on filtered range</span>
        </div>
      </div>

      {/* Average Transaction */}
      <div className="p-4 bg-[#f2f4f6] border border-[#c2c7d1] rounded-xl shadow-sm">
        <p className="text-[11px] font-bold uppercase tracking-wide text-[#505f76] mb-1">Average Transaction</p>
        <p className="text-2xl font-bold text-[#00355f]">₱{avg}</p>
        <div className="flex items-center gap-1 mt-2 text-[#505f76]">
          <Clock size={14} />
          <span className="text-[12px] font-bold">Across {recordCount} records</span>
        </div>
      </div>

      {/* Budget Utilization */}
      <div className="p-4 bg-[#f2f4f6] border border-[#c2c7d1] rounded-xl shadow-sm">
        <p className="text-[11px] font-bold uppercase tracking-wide text-[#505f76] mb-1">Budget Utilization</p>
        <p className="text-2xl font-bold text-[#00355f]">
          ₱{budget.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
        </p>
        <div className="w-full bg-[#c2c7d1] h-1.5 rounded-full mt-2 overflow-hidden">
          <div
            className="bg-[#00355f] h-full transition-all duration-500"
            style={{ width: `${utilPct}%` }}
          />
        </div>
        <p className="text-[12px] mt-1 text-[#505f76]">
          {utilPct.toFixed(1)}% utilized of monthly budget
        </p>
      </div>
    </div>
  );
}