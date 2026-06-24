import { useState } from "react";
import {
  Search,
  CheckSquare,
  Square,
  Calendar,
  CheckCircle2,
  XCircle,
  ChevronDown,
  Filter,
  Clock,
  CheckCheck,
} from "lucide-react";
import type { PettyCashRequest } from "../../types/requests";

type StatusFilter = "All" | "Pending" | "Approved" | "Rejected";

type Props = {
  requests: PettyCashRequest[];
  selectedIds: Set<number>;
  onToggle: (id: number) => void;
  onSelectAll: (visible: PettyCashRequest[]) => void;
  onClearAll: () => void;
  onApproveSingle: (id: number) => void;
  onRejectSingle: (id: number) => void;
  onApproveSelected: () => void;
  onRejectSelected: () => void;
};

const STATUS_TABS: StatusFilter[] = ["All", "Pending", "Approved", "Rejected"];

const statusStyle: Record<string, { bg: string; text: string; dot: string }> = {
  Pending:  { bg: "bg-amber-50",   text: "text-amber-700",  dot: "bg-amber-400" },
  Approved: { bg: "bg-emerald-50", text: "text-emerald-700",dot: "bg-emerald-400" },
  Rejected: { bg: "bg-red-50",     text: "text-red-600",    dot: "bg-red-400" },
};

const inputClass =
  "w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] focus:ring-2 focus:ring-[#00355f]/20 focus:border-[#00355f] outline-none transition-all";

export default function RequestSelector({
  requests,
  selectedIds,
  onToggle,
  onSelectAll,
  onClearAll,
  onApproveSingle,
  onRejectSingle,
  onApproveSelected,
  onRejectSelected,
}: Props) {
  const [search, setSearch]       = useState("");
  const [dateFrom, setDateFrom]   = useState("");
  const [dateTo, setDateTo]       = useState("");
  const [statusTab, setStatusTab] = useState<StatusFilter>("All");
  const [showFilters, setShowFilters] = useState(false);

  // ── Counts per tab ────────────────────────────────────────────────────────
  const counts = {
    All:      requests.length,
    Pending:  requests.filter((r) => r.status === "Pending").length,
    Approved: requests.filter((r) => r.status === "Approved").length,
    Rejected: requests.filter((r) => r.status === "Rejected").length,
  };

  // ── Filtered list ─────────────────────────────────────────────────────────
  const filtered = requests.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch =
      r.description.toLowerCase().includes(q) ||
      r.department.toLowerCase().includes(q) ||
      r.requestedBy.toLowerCase().includes(q) ||
      r.requestNo.toLowerCase().includes(q);
    const matchFrom   = !dateFrom || r.date >= dateFrom;
    const matchTo     = !dateTo   || r.date <= dateTo;
    const matchStatus = statusTab === "All" || r.status === statusTab;
    return matchSearch && matchFrom && matchTo && matchStatus;
  });

  const allSelected = filtered.length > 0 && filtered.every((r) => selectedIds.has(r.id));
  const pendingSelected = [...selectedIds].filter(
    (id) => requests.find((r) => r.id === id)?.status === "Pending"
  );
  const hasPendingSelected = pendingSelected.length > 0;

  return (
    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col overflow-hidden">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[14px] font-bold text-[#00355f]">Petty Cash Requests</h3>
          <p className="text-[11px] text-[#727780] mt-0.5">
            Review, approve, or reject employee requests.
          </p>
        </div>
        <button
          onClick={() => setShowFilters((v) => !v)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[12px] font-semibold transition-all ${
            showFilters
              ? "bg-[#00355f] text-white border-[#00355f]"
              : "bg-slate-50 text-[#727780] border-slate-200 hover:border-[#00355f] hover:text-[#00355f]"
          }`}
        >
          <Filter size={12} />
          Filters
          <ChevronDown
            size={12}
            className={`transition-transform ${showFilters ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* ── Status Tabs ────────────────────────────────────────────────────── */}
      <div className="flex border-b border-slate-100">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusTab(tab)}
            className={`flex-1 py-2.5 text-[12px] font-semibold transition-colors relative ${
              statusTab === tab
                ? "text-[#00355f]"
                : "text-[#727780] hover:text-[#00355f]"
            }`}
          >
            {tab}
            {counts[tab] > 0 && (
              <span
                className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  tab === "Pending"
                    ? "bg-amber-100 text-amber-700"
                    : tab === "Rejected"
                    ? "bg-red-100 text-red-600"
                    : tab === "Approved"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {counts[tab]}
              </span>
            )}
            {statusTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#00355f] rounded-t" />
            )}
          </button>
        ))}
      </div>

      {/* ── Collapsible Filters ─────────────────────────────────────────────── */}
      {showFilters && (
        <div className="px-5 py-4 border-b border-slate-100 space-y-3 bg-slate-50">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0a8b3]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, department, description…"
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
      )}

      {/* ── Select bar ─────────────────────────────────────────────────────── */}
      <div className="px-5 py-2 border-b border-slate-100 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <button
            onClick={() => (allSelected ? onClearAll() : onSelectAll(filtered))}
            className="text-[#00355f] hover:text-[#0f4c81] transition-colors"
            title={allSelected ? "Deselect all" : "Select all visible"}
          >
            {allSelected
              ? <CheckSquare size={15} />
              : <Square size={15} />
            }
          </button>
          <span className="text-[11px] text-[#727780]">
            {selectedIds.size > 0
              ? `${selectedIds.size} selected`
              : `${filtered.length} request${filtered.length !== 1 ? "s" : ""}`}
          </span>
        </div>

        {/* Bulk actions — only shown when pending items are selected */}
        {hasPendingSelected && (
          <div className="flex items-center gap-2">
            <button
              onClick={onApproveSelected}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg transition-colors"
            >
              <CheckCheck size={13} />
              Approve ({pendingSelected.length})
            </button>
            <button
              onClick={onRejectSelected}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-[11px] font-bold rounded-lg transition-colors"
            >
              <XCircle size={13} />
              Reject
            </button>
          </div>
        )}

        {!hasPendingSelected && selectedIds.size === 0 && (
          <button
            onClick={() => onSelectAll(filtered)}
            className="text-[11px] font-semibold text-[#0f4c81] hover:underline"
          >
            Select all
          </button>
        )}

        {selectedIds.size > 0 && !hasPendingSelected && (
          <button
            onClick={onClearAll}
            className="text-[11px] font-semibold text-[#727780] hover:underline"
          >
            Clear
          </button>
        )}
      </div>

      {/* ── Request list ───────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 max-h-[520px]">
        {filtered.length === 0 && (
          <div className="px-5 py-12 flex flex-col items-center gap-2 text-center">
            <Clock size={28} className="text-slate-300" />
            <p className="text-[13px] text-[#a0a8b3]">No requests match your filters.</p>
          </div>
        )}

        {filtered.map((r) => {
          const checked = selectedIds.has(r.id);
          const s = statusStyle[r.status];
          const isPending = r.status === "Pending";

          return (
            <div
              key={r.id}
              className={`flex gap-3 px-5 py-3.5 transition-colors ${
                checked ? "bg-[#f0f7ff]" : "hover:bg-slate-50"
              }`}
            >
              {/* Checkbox */}
              <button
                onClick={() => onToggle(r.id)}
                className={`mt-0.5 shrink-0 transition-colors ${
                  checked ? "text-[#00355f]" : "text-[#c2c7d1] hover:text-[#00355f]"
                }`}
              >
                {checked ? <CheckSquare size={16} /> : <Square size={16} />}
              </button>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Top row */}
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0">
                    <span className="text-[12px] font-bold text-[#00355f] font-mono">
                      {r.requestNo}
                    </span>
                    <p className="text-[12px] font-semibold text-[#1a2e3f] truncate mt-0.5">
                      {r.description}
                    </p>
                  </div>
                  <span className="text-[12px] font-bold text-[#ba1a1a] shrink-0">
                    ₱{r.amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                  </span>
                </div>

                {/* Meta row */}
                <div className="flex flex-wrap gap-x-2 gap-y-1 mt-1.5 items-center">
                  <span className="text-[10px] font-bold uppercase text-[#00355f] bg-[#00355f]/8 px-1.5 py-0.5 rounded">
                    {r.department}
                  </span>
                  <span className="text-[10px] text-[#727780]">{r.requestedBy}</span>
                  <span className="text-[10px] text-[#727780]">·</span>
                  <span className="text-[10px] text-[#727780]">{r.date}</span>

                  {/* Status badge */}
                  <span
                    className={`ml-auto flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${s.bg} ${s.text}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                    {r.status}
                  </span>
                </div>

                {/* Inline approve / reject — only for Pending */}
                {isPending && (
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => onApproveSingle(r.id)}
                      className="flex items-center gap-1 px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold rounded-lg border border-emerald-200 transition-colors"
                    >
                      <CheckCircle2 size={12} />
                      Approve
                    </button>
                    <button
                      onClick={() => onRejectSingle(r.id)}
                      className="flex items-center gap-1 px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 text-[11px] font-bold rounded-lg border border-red-200 transition-colors"
                    >
                      <XCircle size={12} />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}