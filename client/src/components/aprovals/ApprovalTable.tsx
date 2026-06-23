import { useState } from "react";
import { Eye, Search, Filter, Check, X } from "lucide-react";
import type { ApprovalTransaction, ApprovalStatus } from "../../types/approvals";

type Props = {
  transactions: ApprovalTransaction[];
  onSelect: (t: ApprovalTransaction) => void;   // ← full object, not just id
  selectedId: number | null;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
};

const STATUS_STYLES: Record<ApprovalStatus, string> = {
  Pending:  "bg-amber-50 text-amber-700 border-amber-200",
  Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Rejected: "bg-red-50 text-[#ba1a1a] border-red-200",
};
const STATUS_DOT: Record<ApprovalStatus, string> = {
  Pending:  "bg-amber-400",
  Approved: "bg-emerald-500",
  Rejected: "bg-[#ba1a1a]",
};

function fmt(n: number) {
  return n.toLocaleString("en-PH", { minimumFractionDigits: 2 });
}

function SignatureProgress({ signatures }: { signatures: ApprovalTransaction["signatures"] }) {
  return (
    <div className="flex items-center gap-0.5">
      {signatures.map((s, i) => (
        <div key={s.role} className="flex items-center gap-0.5">
          <div
            title={`${s.role}: ${s.signed ? s.signedBy : "Awaiting"}`}
            className={`w-5 h-5 rounded-full border text-[8px] font-bold flex items-center justify-center select-none
              ${s.signed
                ? "bg-emerald-500 border-emerald-500 text-white"
                : "bg-white border-[#c2c7d1] text-[#a0a8b3]"
              }`}
          >
            {s.role[0]}
          </div>
          {i < signatures.length - 1 && (
            <div className={`w-3 h-px ${s.signed ? "bg-emerald-400" : "bg-[#c2c7d1]"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function ApprovalsTable({
  transactions, onSelect, selectedId, onApprove, onReject,
}: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | ApprovalStatus>("All");

  const filtered = transactions.filter((t) => {
    const q = search.toLowerCase();
    const matchSearch =
      t.description.toLowerCase().includes(q) ||
      t.employeeName.toLowerCase().includes(q) ||
      t.department.toLowerCase().includes(q);
    const matchStatus = statusFilter === "All" || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="bg-white border border-[#c2c7d1] rounded-2xl shadow-sm overflow-hidden flex flex-col">
      {/* Toolbar */}
      <div className="px-5 py-3 border-b border-[#c2c7d1] flex flex-wrap gap-3 items-center bg-[#f7f9fb]">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0a8b3]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, description, department…"
            className="w-full h-8 border border-[#c2c7d1] rounded-lg pl-8 pr-3 text-[12px] focus:border-[#00355f] focus:ring-1 focus:ring-[#00355f]/20 outline-none bg-white"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={13} className="text-[#a0a8b3]" />
          {(["All", "Pending", "Approved", "Rejected"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border transition-colors
                ${statusFilter === s
                  ? "bg-[#00355f] text-white border-[#00355f]"
                  : "bg-white text-[#727780] border-[#c2c7d1] hover:border-[#00355f] hover:text-[#00355f]"
                }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-420px)]">
        <table className="w-full text-left border-collapse text-[12px]">
          <thead className="sticky top-0 z-10">
            <tr className="bg-[#f7f9fb] border-b border-[#c2c7d1]">
              <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#727780]">Ref</th>
              <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#727780]">Date</th>
              <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#727780]">Applicant</th>
              <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#727780]">Dept</th>
              <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#727780]">Description</th>
              <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#727780] text-right">Amount</th>
              <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#727780]">Sign-offs</th>
              <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#727780] text-center">Status</th>
              <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#727780] text-center">View</th>
              <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#727780] text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#c2c7d1]/40">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={10} className="px-4 py-12 text-center text-[13px] text-[#a0a8b3]">
                  No requests match your filters.
                </td>
              </tr>
            )}
            {filtered.map((t) => (
              <tr
                key={t.id}
                onClick={() => onSelect(t)}
                className={`cursor-pointer transition-colors hover:bg-[#f0f7ff]
                  ${selectedId === t.id ? "bg-[#e8f1fb] border-l-2 border-l-[#00355f]" : ""}`}
              >
                <td className="px-4 py-3 font-mono text-[#727780] text-[10px] whitespace-nowrap">
                  #{String(t.id).padStart(4, "0")}
                </td>
                <td className="px-4 py-3 text-[#505f76] whitespace-nowrap">{t.date}</td>
                <td className="px-4 py-3 min-w-[130px]">
                  <div className="font-semibold text-[#1a2e3f] leading-tight">{t.employeeName}</div>
                  <div className="text-[10px] text-[#727780]">{t.employeeId}</div>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#00355f]/10 text-[#00355f] font-bold text-[10px] uppercase tracking-wide whitespace-nowrap">
                    {t.department}
                  </span>
                </td>
                <td className="px-4 py-3 text-[#1a2e3f] max-w-[180px] truncate">{t.description}</td>
                <td className="px-4 py-3 text-right font-bold text-[#ba1a1a] whitespace-nowrap">
                  ₱{fmt(t.payOut)}
                </td>
                <td className="px-4 py-3">
                  <SignatureProgress signatures={t.signatures} />
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border whitespace-nowrap ${STATUS_STYLES[t.status]}`}>
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${STATUS_DOT[t.status]}`} />
                    {t.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={(e) => { e.stopPropagation(); onSelect(t); }}
                    className="p-1.5 rounded-lg text-[#727780] hover:text-[#00355f] hover:bg-[#00355f]/10 transition-colors"
                    title="View full request"
                  >
                    <Eye size={15} />
                  </button>
                </td>
                <td className="px-4 py-3 text-center">
                  {t.status === "Pending" ? (
                    <div className="flex gap-1 justify-center">
                      <button
                        onClick={(e) => { e.stopPropagation(); onApprove(t.id); }}
                        className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                        title="Approve"
                      >
                        <Check size={13} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onReject(t.id); }}
                        className="p-1.5 rounded-lg bg-red-50 text-[#ba1a1a] hover:bg-red-100 border border-red-200 transition-colors"
                        title="Reject"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ) : (
                    <span className="text-[11px] text-[#a0a8b3] font-medium">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer count */}
      <div className="px-5 py-2.5 bg-[#f7f9fb] border-t border-[#c2c7d1]">
        <span className="text-[11px] text-[#727780]">
          Showing {filtered.length} of {transactions.length} requests
        </span>
      </div>
    </div>
  );
}