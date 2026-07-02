import { ChevronDown, Eye, Pencil, Printer, Trash2 } from "lucide-react";
import type { Request } from "../../../types/requestList";
import ApprovalPipeline from "../../../components/Employee/list/Approvalpipline";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const STATUS_STYLE: Record<
  Request["status"],
  { bg: string; text: string; dot: string }
> = {
  approved: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  pending:  { bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-400"   },
  rejected: { bg: "bg-red-50",     text: "text-red-600",     dot: "bg-red-500"     },
};

function normalizeStatus(raw: string): Request["status"] {
  const lower = raw?.toLowerCase?.() ?? "";
  if (lower === "approved" || lower === "rejected" || lower === "pending") return lower;
  return "pending";
}

function formatAmount(amount: string, currency: string): string {
  const sym = currency === "PHP" ? "₱" : currency === "USD" ? "$" : `${currency} `;
  return `${sym}${parseFloat(amount).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface Props {
  req:      Request;
  expanded: boolean;
  onToggle: () => void;
  onView:   (req: Request) => void;
  onPrint:  (req: Request) => void;
  onEdit:   (req: Request) => void;
  onDelete: (req: Request) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function RequestCard({
  req, expanded, onToggle,
  onView, onPrint, onEdit, onDelete,
}: Props) {
  const status = normalizeStatus(req.status);
  const badge  = STATUS_STYLE[status];

  // Only pending requests can be edited or deleted
  const canEdit   = status === "pending";
  const canDelete = status === "pending";

  return (
    <div
      className={`overflow-hidden rounded-2xl border bg-white transition-colors ${
        expanded ? "border-[#00355f]/30" : "border-zinc-200 hover:border-zinc-300"
      }`}
    >
      {/* ── Clickable header row ─────────────────────────────────────────── */}
      <button
        type="button"
        onClick={onToggle}
        className="grid w-full items-start gap-3 px-5 py-4 text-left"
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

      {/* ── Expandable: pipeline + actions ──────────────────────────────── */}
      {expanded && (
        <>
          <div className="border-t border-zinc-100 px-5 py-4">
            <ApprovalPipeline approvals={req.approvals} />
          </div>

          <div className="flex items-center justify-between border-t border-zinc-100 bg-slate-50/60 px-5 py-2.5">
            <span className="text-[11px] text-slate-400">Last updated {req.date}</span>

            <div className="flex gap-2">
              {/* View — always available */}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onView(req); }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-[12px] font-medium text-slate-600 transition-colors hover:border-[#00355f]/40 hover:text-[#00355f]"
              >
                <Eye size={13} /> View
              </button>

              {/* Print — always available */}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onPrint(req); }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-[12px] font-medium text-slate-600 transition-colors hover:border-[#00355f]/40 hover:text-[#00355f]"
              >
                <Printer size={13} /> Print
              </button>

              {/* Edit — pending only */}
              {canEdit && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onEdit(req); }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-[12px] font-medium text-amber-700 transition-colors hover:bg-amber-100"
                >
                  <Pencil size={13} /> Edit
                </button>
              )}

              {/* Delete — pending only */}
              {canDelete && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onDelete(req); }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-[12px] font-medium text-red-600 transition-colors hover:bg-red-100"
                >
                  <Trash2 size={13} /> Delete
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}