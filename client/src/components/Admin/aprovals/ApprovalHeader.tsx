import type { ApprovalTransaction } from "../../../types/approvals";

type Props = {
  transactions: ApprovalTransaction[];
};

export default function ApprovalsHeader({ transactions }: Props) {
  const total    = transactions.length;
  const pending  = transactions.filter((t) => t.status === "Pending").length;
  const approved = transactions.filter((t) => t.status === "Approved").length;
  const rejected = transactions.filter((t) => t.status === "Rejected").length;

  const stats = [
    { label: "Total Requests", value: total,    color: "text-[#00355f]",  bar: "bg-[#00355f]",  pct: 100 },
    { label: "Pending",        value: pending,  color: "text-amber-600",  bar: "bg-amber-400",  pct: total ? Math.round((pending  / total) * 100) : 0 },
    { label: "Approved",       value: approved, color: "text-emerald-700",bar: "bg-emerald-500",pct: total ? Math.round((approved / total) * 100) : 0 },
    { label: "Rejected",       value: rejected, color: "text-[#ba1a1a]",  bar: "bg-[#ba1a1a]",  pct: total ? Math.round((rejected / total) * 100) : 0 },
  ];

  return (
    <div className="w-full space-y-5">
      {/* Title */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#4a7fa5] mb-1">Admin</p>
        <h2 className="text-2xl font-bold text-[#00355f] leading-tight">Approval Queue</h2>
        <p className="text-[13px] text-[#505f76] mt-1">
          Review, approve, or reject submitted payment requests. Each request follows the{" "}
          <span className="font-semibold text-[#00355f]">Applicant → Supervisor → Director → FA</span> sign-off chain.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-[#c2c7d1] rounded-xl shadow-sm px-5 py-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#727780] mb-1">{s.label}</p>
            <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
            <div className="mt-2 w-full h-1 bg-[#eceef0] rounded-full overflow-hidden">
              <div className={`h-full ${s.bar} rounded-full transition-all duration-500`} style={{ width: `${s.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}