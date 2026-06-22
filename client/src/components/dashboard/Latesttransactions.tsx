import { List, Filter, MoreVertical, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { DashboardTransaction } from "../../types/dashboard";

type Props = {
  transactions: DashboardTransaction[];
};

function StatusBadge({ status }: { status: DashboardTransaction["status"] }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border
        ${status === "Completed"
          ? "bg-green-50 text-green-700 border-green-200"
          : "bg-amber-50 text-amber-700 border-amber-200"
        }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${status === "Completed" ? "bg-green-500" : "bg-amber-400"}`} />
      {status}
    </span>
  );
}

function fmt(v: string) {
  const n = parseFloat(v);
  if (isNaN(n)) return v;
  return `₱${n.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;
}

export default function LatestTransactions({ transactions }: Props) {
  const navigate = useNavigate();

  return (
    <section className="bg-white rounded-xl border border-[#c2c7d1] overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#c2c7d1] flex justify-between items-center bg-[#f7f9fb]">
        <div className="flex items-center gap-2">
          <List size={18} className="text-[#00355f]" />
          <h3 className="text-[15px] font-semibold text-[#00355f]">Latest Transactions</h3>
          <span className="text-[10px] font-bold text-[#727780] bg-[#eceef0] px-2 py-0.5 rounded-full ml-1">
            {transactions.length} shown
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-1.5 rounded-lg text-[#727780] hover:text-[#00355f] hover:bg-[#eceef0] transition-colors">
            <Filter size={16} />
          </button>
          <button className="p-1.5 rounded-lg text-[#727780] hover:text-[#00355f] hover:bg-[#eceef0] transition-colors">
            <MoreVertical size={16} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-[#f7f9fb] border-b border-[#c2c7d1]">
              {["Date", "Department", "Unit", "Item", "Description", "Pay Out", "VAT", "W/O VAT", "Delivery", "Balance", "Status"].map((h, i) => (
                <th
                  key={h}
                  className={`px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#727780] ${i >= 5 && i <= 9 ? "text-right" : i === 10 ? "text-center" : ""}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#c2c7d1]/40">
            {transactions.map((t) => (
              <tr key={t.id} className="hover:bg-[#f0f7ff] transition-colors group">
                <td className="px-4 py-3 text-[#505f76] text-xs whitespace-nowrap">{t.date}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#00355f]/8 text-[#00355f] font-bold text-[10px] uppercase tracking-wide">
                    {t.department}
                  </span>
                </td>
                <td className="px-4 py-3 text-[#505f76] text-xs">{t.unit}</td>
                <td className="px-4 py-3 text-[#505f76] text-xs">{t.item}</td>
                <td className="px-4 py-3 text-[#1a2e3f] text-xs max-w-[160px] truncate">{t.description}</td>
                <td className="px-4 py-3 text-right text-xs font-bold text-[#ba1a1a] whitespace-nowrap">{fmt(t.payOut)}</td>
                <td className="px-4 py-3 text-right text-xs text-[#505f76]">
                  {t.VAT === "0" ? "—" : fmt(t.VAT)}
                </td>
                <td className="px-4 py-3 text-right text-xs text-[#505f76]">{fmt(t.withoutVAT)}</td>
                <td className="px-4 py-3 text-right text-xs text-[#505f76]">{fmt(t.deliveryFee)}</td>
                <td className="px-4 py-3 text-right text-xs font-bold text-[#07497d] whitespace-nowrap">{fmt(t.balance)}</td>
                <td className="px-4 py-3 text-center">
                  <StatusBadge status={t.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 flex justify-between items-center bg-[#f7f9fb] border-t border-[#c2c7d1]">
        <p className="text-[12px] text-[#727780]">
          Showing {transactions.length} of 42 transactions
        </p>
        <button
          onClick={() => navigate("/transactions")}
          className="flex items-center gap-1.5 text-[12px] font-semibold text-[#0f4c81] hover:text-[#00355f] transition-colors"
        >
          View all transactions
          <ArrowRight size={14} />
        </button>
      </div>
    </section>
  );
}