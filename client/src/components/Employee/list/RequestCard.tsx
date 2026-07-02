import { ChevronDown, Eye, Printer } from "lucide-react";
import type { Request } from "../../../types/requestList";
import ApprovalPipeline from "./Approvalpipline";

const STATUS_STYLE: Record<
  Request["status"],
  { bg: string; text: string; dot: string }
> = {
  approved: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  pending:  { bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-400"   },
  rejected: { bg: "bg-red-50",     text: "text-red-600",     dot: "bg-red-500"     },
};

function formatAmount(amount: string, currency: string): string {
  const sym = currency === "PHP" ? "₱" : currency === "USD" ? "$" : `${currency} `;
  return `${sym}${parseFloat(amount).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;
}

interface Props {
  req: Request;
  expanded: boolean;
  onToggle: () => void;
}

// Normalize any casing the API might return ("Approved", "APPROVED" → "approved")
function normalizeStatus(raw: string): Request["status"] {
  const lower = raw?.toLowerCase();
  if (lower === "approved" || lower === "rejected" || lower === "pending") return lower;
  return "pending"; // safe fallback — won't crash; shows as amber
}

export default function RequestCard({ req, expanded, onToggle }: Props) {
  const status = normalizeStatus(req.status);
  const badge  = STATUS_STYLE[status];

  return (
    <div
      className={`overflow-hidden rounded-2xl border bg-white transition-colors ${
        expanded ? "border-[#00355f]/30" : "border-zinc-200 hover:border-zinc-300"
      }`}
    >
      {/* Header row — click to expand */}
      <button
        type="button"
        onClick={onToggle}
        className="grid w-full items-start gap-3 px-5 py-4 text-left"
        style={{ gridTemplateColumns: "1fr auto" }}
      >
        {/* Left: meta + description */}
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

        {/* Right: amount + badge + chevron */}
        <div className="flex flex-shrink-0 flex-col items-end gap-2">
          <div className="text-right">
            <p className="text-[10px] text-slate-400">{req.currency}</p>
            <p className="font-mono text-[15px] font-medium text-[#1a2e3f]">
              {formatAmount(req.amount, req.currency)}
            </p>
          </div>
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${badge.bg} ${badge.text}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${badge.dot}`} />
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
          <ChevronDown
            size={16}
            className={`text-slate-400 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {/* Expandable: pipeline + footer actions */}
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