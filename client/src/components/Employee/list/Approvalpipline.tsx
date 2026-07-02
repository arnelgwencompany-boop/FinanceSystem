import { Check, Clock, X } from "lucide-react";
import type { Approval } from "../../../types/requestList";

export default function ApprovalPipeline({ approvals }: { approvals: Approval[] }) {
  const total = approvals.length;
  const doneCount = approvals.filter((a) => a.status === "approved").length;

  const fillPct =
    doneCount === 0       ? 0
    : doneCount === total ? 75
    : ((doneCount - 1) / (total - 1)) * 75;

  // Mark the first non-done, non-rejected stage as "current"
  let fpSeen = false;
  const stages = approvals.map((a) => {
    const isCurrent = a.status !== "approved" && a.status !== "rejected" && !fpSeen;
    if (isCurrent) fpSeen = true;
    return { ...a, isCurrent };
  });

  const nodeClass = (status: Approval["status"], isCurrent: boolean) => {
    if (status === "approved") return "bg-emerald-500 border-emerald-500 text-white";
    if (status === "rejected") return "bg-red-50 border-red-500 text-red-500";
    if (isCurrent)             return "bg-amber-50 border-amber-400 text-amber-500";
    return "bg-slate-100 border-slate-200 text-slate-400";
  };

  const nodeIcon = (status: Approval["status"], isCurrent: boolean) => {
    if (status === "approved") return <Check size={14} strokeWidth={2.5} />;
    if (status === "rejected") return <X size={14} strokeWidth={2.5} />;
    if (isCurrent)             return <Clock size={13} />;
    return null;
  };

  const half = `${100 / total / 2}%`;

  return (
    <div>
      <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
        Approval pipeline
      </p>
      <div className="relative grid" style={{ gridTemplateColumns: `repeat(${total}, 1fr)` }}>
        {/* Track background */}
        <div className="absolute top-4 h-0.5 bg-zinc-200" style={{ left: half, right: half }} />
        {/* Fill */}
        <div
          className="absolute top-4 h-0.5 bg-emerald-400 transition-all duration-500"
          style={{ left: half, width: `${fillPct}%` }}
        />
        {stages.map((a) => (
          <div key={a.id} className="relative z-10 flex flex-col items-center gap-1.5">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all ${nodeClass(a.status, a.isCurrent)}`}
            >
              {nodeIcon(a.status, a.isCurrent)}
            </div>
            <span className="text-center text-[11px] font-medium leading-tight text-slate-600">
              {a.role}
            </span>
            <span className="max-w-[72px] truncate text-center text-[10px] text-slate-400">
              {a.signed_by_name ?? "—"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}