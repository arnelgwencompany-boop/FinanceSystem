import { useState } from "react";
import {
  CheckCircle2, Clock, XCircle, FileText,
  Plus, Search, ChevronDown, Eye, Printer, Check, X,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
// Keep the same shape from the original file — just drop in new mock data.
interface Approval {
  id: number;
  role: string;
  status: "pending" | "approved" | "rejected";
  signed_by_name: string | null;
}

interface Request {
  id: number;
  request_no: string;
  description: string;
  date: string;
  amount: string;
  currency: string;
  department: string;
  status: "pending" | "approved" | "rejected";
  approvals: Approval[];
}

type FilterStatus = "all" | "pending" | "approved" | "rejected";

// ─── Mock Data ────────────────────────────────────────────────────────────────
// TODO: replace with a real fetch from GET /api/requests/
const REQUESTS: Request[] = [
  {
    id: 1,
    request_no: "REQ-00001",
    description: "Purchase of new laptop for development team",
    date: "2026-06-25",
    amount: "75000.00",
    currency: "PHP",
    department: "IT Ops",
    status: "approved",
    approvals: [
      { id: 1, role: "Supervisor", status: "approved",  signed_by_name: "Maria Santos"  },
      { id: 2, role: "Director",   status: "approved",  signed_by_name: "Eduardo Reyes" },
      { id: 3, role: "Finance",    status: "approved",  signed_by_name: "Ana Flores"    },
      { id: 4, role: "Admin",      status: "pending",   signed_by_name: null            },
    ],
  },
  {
    id: 2,
    request_no: "REQ-00002",
    description: "Office supplies restock — Q3 stationery and printing materials",
    date: "2026-06-20",
    amount: "12500.00",
    currency: "PHP",
    department: "Admin",
    status: "pending",
    approvals: [
      { id: 5, role: "Supervisor", status: "approved", signed_by_name: "Maria Santos" },
      { id: 6, role: "Director",   status: "pending",  signed_by_name: null           },
      { id: 7, role: "Finance",    status: "pending",  signed_by_name: null           },
      { id: 8, role: "Admin",      status: "pending",  signed_by_name: null           },
    ],
  },
  {
    id: 3,
    request_no: "REQ-00003",
    description: "Team offsite transportation and accommodation — Tagaytay sprint",
    date: "2026-06-10",
    amount: "38200.00",
    currency: "PHP",
    department: "IT Ops",
    status: "rejected",
    approvals: [
      { id: 9,  role: "Supervisor", status: "approved", signed_by_name: "Maria Santos"  },
      { id: 10, role: "Director",   status: "rejected", signed_by_name: "Eduardo Reyes" },
      { id: 11, role: "Finance",    status: "pending",  signed_by_name: null            },
      { id: 12, role: "Admin",      status: "pending",  signed_by_name: null            },
    ],
  },
  {
    id: 4,
    request_no: "REQ-00004",
    description: "Software license renewal — Figma and Notion annual plan",
    date: "2026-05-28",
    amount: "29000.00",
    currency: "PHP",
    department: "IT Ops",
    status: "approved",
    approvals: [
      { id: 13, role: "Supervisor", status: "approved", signed_by_name: "Maria Santos"  },
      { id: 14, role: "Director",   status: "approved", signed_by_name: "Eduardo Reyes" },
      { id: 15, role: "Finance",    status: "approved", signed_by_name: "Ana Flores"    },
      { id: 16, role: "Admin",      status: "approved", signed_by_name: "Carlo Mendoza" },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const STATUS_BADGE: Record<
  Request["status"],
  { bg: string; text: string; dot: string; icon: React.ReactNode }
> = {
  approved: {
    bg:   "bg-emerald-50",
    text: "text-emerald-700",
    dot:  "bg-emerald-500",
    icon: <CheckCircle2 size={12} />,
  },
  pending: {
    bg:   "bg-amber-50",
    text: "text-amber-700",
    dot:  "bg-amber-400",
    icon: <Clock size={12} />,
  },
  rejected: {
    bg:   "bg-red-50",
    text: "text-red-600",
    dot:  "bg-red-500",
    icon: <XCircle size={12} />,
  },
};

function formatAmount(amount: string, currency: string): string {
  const sym = currency === "PHP" ? "₱" : currency === "USD" ? "$" : `${currency} `;
  return `${sym}${parseFloat(amount).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;
}

// ─── Pipeline component ───────────────────────────────────────────────────────
// Renders the horizontal approval chain with a progress fill line.
function ApprovalPipeline({ approvals }: { approvals: Approval[] }) {
  const doneCount = approvals.filter((a) => a.status === "approved").length;
  const total = approvals.length;

  // Fill line width as a percentage of the track (track spans stage-centres 1→N)
  const fillPct =
    doneCount === 0 ? 0
    : doneCount === total ? 75          // full: ends at last stage centre
    : ((doneCount - 1) / (total - 1)) * 75; // partial: stop at last done centre

  let seenPending = false;

  const nodeStyle = (status: Approval["status"]) => {
    if (status === "approved") return "bg-emerald-500 border-emerald-500 text-white";
    if (status === "rejected") return "bg-red-50 border-red-500 text-red-500";
    if (!seenPending) { seenPending = true; return "bg-amber-50 border-amber-400 text-amber-500"; }
    return "bg-slate-100 border-slate-200 text-slate-400";
  };

  const nodeIcon = (status: Approval["status"], isFirstPending: boolean) => {
    if (status === "approved") return <Check size={14} strokeWidth={2.5} />;
    if (status === "rejected") return <X size={14} strokeWidth={2.5} />;
    if (isFirstPending)        return <Clock size={13} />;
    return null;
  };

  // Recalculate first-pending state cleanly for icons
  let fpSeen = false;
  const stages = approvals.map((a) => {
    const isFirst = a.status !== "approved" && a.status !== "rejected" && !fpSeen;
    if (isFirst) fpSeen = true;
    return { ...a, isFirst };
  });

  return (
    <div>
      <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
        Approval pipeline
      </p>
      <div className="relative grid" style={{ gridTemplateColumns: `repeat(${total}, 1fr)` }}>
        {/* Track */}
        <div className="absolute top-4 h-0.5 bg-zinc-200" style={{ left: `${100 / total / 2}%`, right: `${100 / total / 2}%` }} />
        {/* Fill */}
        <div
          className="absolute top-4 h-0.5 bg-emerald-400 transition-all duration-500"
          style={{ left: `${100 / total / 2}%`, width: `${fillPct}%` }}
        />

        {stages.map((a) => {
          // Reset seenPending for nodeStyle — compute inline
          const cls = nodeStyle(a.status);
          return (
            <div key={a.id} className="relative z-10 flex flex-col items-center gap-1.5">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-[13px] transition-all ${cls}`}
              >
                {nodeIcon(a.status, a.isFirst)}
              </div>
              <span className="text-center text-[11px] font-medium leading-tight text-slate-600">
                {a.role}
              </span>
              <span className="max-w-[72px] truncate text-center text-[10px] text-slate-400">
                {a.signed_by_name ?? "—"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Request card ─────────────────────────────────────────────────────────────
function RequestCard({
  req,
  expanded,
  onToggle,
}: {
  req: Request;
  expanded: boolean;
  onToggle: () => void;
}) {
  const badge = STATUS_BADGE[req.status];

  return (
    <div
      className={`overflow-hidden rounded-2xl border bg-white transition-colors ${
        expanded ? "border-[#00355f]/30" : "border-zinc-200 hover:border-zinc-300"
      }`}
    >
      {/* Card header — clickable to expand */}
      <button
        type="button"
        onClick={onToggle}
        className="grid w-full cursor-pointer items-start gap-3 px-5 py-4 text-left"
        style={{ gridTemplateColumns: "1fr auto" }}
      >
        {/* Left */}
        <div>
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 font-mono text-[11px] font-medium text-blue-700">
              {req.request_no}
            </span>
            <span className="text-[11px] text-slate-400">{req.date}</span>
            <span className="rounded-full border border-zinc-200 bg-slate-50 px-2 py-0.5 text-[11px] text-slate-500">
              {req.department}
            </span>
          </div>
          <p className="text-[14px] font-medium leading-snug text-[#1a2e3f]">
            {req.description}
          </p>
        </div>

        {/* Right */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <div className="text-right">
            <p className="text-[10px] text-slate-400">{req.currency}</p>
            <p className="font-mono text-[15px] font-medium text-[#1a2e3f]">
              {formatAmount(req.amount, req.currency)}
            </p>
          </div>
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${badge.bg} ${badge.text}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`} />
            {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
          </span>
          <ChevronDown
            size={16}
            className={`text-slate-400 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {/* Expandable pipeline + actions */}
      {expanded && (
        <>
          <div className="border-t border-zinc-100 px-5 py-4">
            <ApprovalPipeline approvals={req.approvals} />
          </div>
          <div className="flex items-center justify-between border-t border-zinc-100 bg-slate-50/60 px-5 py-2.5">
            <span className="text-[11px] text-slate-400">Last updated {req.date}</span>
            <div className="flex gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-[12px] font-medium text-slate-600 transition-colors hover:border-zinc-300 hover:text-slate-800"
              >
                <Eye size={13} /> View
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-[12px] font-medium text-slate-600 transition-colors hover:border-zinc-300 hover:text-slate-800"
              >
                <Printer size={13} /> Print
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function EmployeeRequestList() {
  const [filter,   setFilter]   = useState<FilterStatus>("all");
  const [query,    setQuery]    = useState("");
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const toggle = (id: number) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });

  const visible = REQUESTS.filter((r) => {
    const matchFilter = filter === "all" || r.status === filter;
    const q = query.toLowerCase();
    const matchQuery =
      !q ||
      r.request_no.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q);
    return matchFilter && matchQuery;
  });

  const counts = {
    all:      REQUESTS.length,
    pending:  REQUESTS.filter((r) => r.status === "pending").length,
    approved: REQUESTS.filter((r) => r.status === "approved").length,
    rejected: REQUESTS.filter((r) => r.status === "rejected").length,
  };

  const FILTERS: { label: string; value: FilterStatus }[] = [
    { label: "All",      value: "all"      },
    { label: "Pending",  value: "pending"  },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
  ];

  return (
    <div className="ml-[260px] mt-16 min-h-[calc(100vh-64px)] overflow-y-auto bg-[#eef1f4]">
      <div className="mx-auto max-w-4xl px-6 py-10">

        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[22px] font-bold text-[#1a2e3f]">My requests</h1>
            <p className="mt-0.5 text-[14px] text-slate-500">
              Track and manage your submitted payment requests.
            </p>
          </div>
          <button
            type="button"
            className="flex flex-shrink-0 items-center gap-2 rounded-xl bg-[#00355f] px-4 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-[#0f4c81]"
          >
            <Plus size={16} /> New request
          </button>
        </div>

        {/* Stats */}
        <div className="mb-5 grid grid-cols-4 gap-3">
          {[
            { label: "Total",    value: counts.all,      color: "text-[#1a2e3f]" },
            { label: "Pending",  value: counts.pending,  color: "text-amber-600"  },
            { label: "Approved", value: counts.approved, color: "text-emerald-600" },
            { label: "Rejected", value: counts.rejected, color: "text-red-500"    },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-white px-4 py-3 shadow-sm border border-zinc-200">
              <p className={`text-[22px] font-bold ${s.color}`}>{s.value}</p>
              <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by ID or description…"
              className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-9 pr-4 text-[13px] text-[#1a2e3f] outline-none placeholder:text-slate-400 focus:border-[#00355f]"
            />
          </div>
          {/* Filter pills */}
          <div className="flex gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                className={`rounded-full border px-3.5 py-1.5 text-[12px] font-medium transition-all ${
                  filter === f.value
                    ? "border-[#00355f] bg-[#00355f] text-white"
                    : "border-zinc-200 bg-white text-slate-500 hover:border-zinc-300"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Request cards */}
        <div className="flex flex-col gap-3">
          {visible.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <FileText size={32} className="mb-3 text-slate-300" />
              <p className="text-[14px] font-medium text-slate-400">No requests match this filter.</p>
              <button
                type="button"
                onClick={() => { setFilter("all"); setQuery(""); }}
                className="mt-3 text-[13px] font-medium text-[#00355f] hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            visible.map((req) => (
              <RequestCard
                key={req.id}
                req={req}
                expanded={expanded.has(req.id)}
                onToggle={() => toggle(req.id)}
              />
            ))
          )}
        </div>

      </div>
    </div>
  );
}