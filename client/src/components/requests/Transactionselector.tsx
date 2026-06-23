import { useState } from "react";
import { Search, CheckSquare, Square, Calendar } from "lucide-react";
import type { Transaction } from "../../types/requests";

type Props = {
  transactions: Transaction[];
  selectedIds: Set<number>;
  onToggle: (id: number) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
};

export default function TransactionSelector({
  transactions,
  selectedIds,
  onToggle,
  onSelectAll,
  onClearAll,
}: Props) {
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filtered = transactions.filter((t) => {
    const q = search.toLowerCase();
    const matchSearch =
      t.description.toLowerCase().includes(q) ||
      t.department.toLowerCase().includes(q);
    const matchFrom = !dateFrom || t.date >= dateFrom;
    const matchTo = !dateTo || t.date <= dateTo;
    return matchSearch && matchFrom && matchTo;
  });

  const allSelected = filtered.length > 0 && filtered.every((t) => selectedIds.has(t.id));
  const inputClass =
    "w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] focus:ring-2 focus:ring-[#00355f]/20 focus:border-[#00355f] outline-none transition-all";

  return (
    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100">
        <h3 className="text-[14px] font-bold text-[#00355f]">Select Transactions</h3>
        <p className="text-[11px] text-[#727780] mt-0.5">
          Choose which records to include in the payment request.
        </p>
      </div>

      {/* Filters */}
      <div className="px-5 py-4 border-b border-slate-100 space-y-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0a8b3]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search description or department…"
            className={`${inputClass} pl-8`}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#727780]">From</label>
            <div className="relative">
              <Calendar size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#a0a8b3]" />
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className={`${inputClass} pl-7 text-xs`} />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#727780]">To</label>
            <div className="relative">
              <Calendar size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#a0a8b3]" />
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className={`${inputClass} pl-7 text-xs`} />
            </div>
          </div>
        </div>
      </div>

      {/* Select all / clear */}
      <div className="px-5 py-2 border-b border-slate-100 flex justify-between items-center">
        <span className="text-[11px] text-[#727780]">
          {selectedIds.size} of {transactions.length} selected
        </span>
        <div className="flex gap-3">
          <button onClick={onSelectAll} className="text-[11px] font-semibold text-[#0f4c81] hover:underline">
            Select all
          </button>
          <button onClick={onClearAll} className="text-[11px] font-semibold text-[#727780] hover:underline">
            Clear
          </button>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 max-h-[420px]">
        {filtered.length === 0 && (
          <p className="px-5 py-8 text-center text-[13px] text-[#a0a8b3]">No transactions match.</p>
        )}
        {filtered.map((t) => {
          const checked = selectedIds.has(t.id);
          return (
            <button
              key={t.id}
              onClick={() => onToggle(t.id)}
              className={`w-full text-left px-5 py-3 flex gap-3 items-start hover:bg-[#f0f7ff] transition-colors ${checked ? "bg-[#f0f7ff]" : ""}`}
            >
              <span className={`mt-0.5 shrink-0 ${checked ? "text-[#00355f]" : "text-[#c2c7d1]"}`}>
                {checked ? <CheckSquare size={16} /> : <Square size={16} />}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex justify-between items-baseline gap-2">
                  <span className="text-[12px] font-semibold text-[#1a2e3f] truncate">{t.description}</span>
                  <span className="text-[11px] font-bold text-[#ba1a1a] shrink-0">
                    ₱{t.payOut.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex gap-2 mt-0.5">
                  <span className="text-[10px] font-bold uppercase text-[#00355f] bg-[#00355f]/8 px-1.5 py-0.5 rounded">{t.department}</span>
                  <span className="text-[10px] text-[#727780]">{t.date}</span>
                  <span className={`text-[10px] font-bold ${t.status === "Completed" ? "text-emerald-600" : "text-amber-600"}`}>
                    {t.status}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}