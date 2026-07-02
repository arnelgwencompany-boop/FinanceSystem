import type { Request } from "../../../types/requestList";

interface Props {
  requests: Request[];
}

const STATS = [
  { label: "Total",    key: "all"      as const, color: "text-[#1a2e3f]"   },
  { label: "Pending",  key: "pending"  as const, color: "text-amber-600"   },
  { label: "Approved", key: "approved" as const, color: "text-emerald-600" },
  { label: "Rejected", key: "rejected" as const, color: "text-red-500"     },
];

export default function StatsBar({ requests }: Props) {
  const counts = {
    all:      requests.length,
    pending:  requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  };

  return (
    <div className="grid grid-cols-4 gap-3">
      {STATS.map((s) => (
        <div key={s.label} className="rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-sm">
          <p className={`text-[22px] font-bold ${s.color}`}>{counts[s.key]}</p>
          <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-slate-400">
            {s.label}
          </p>
        </div>
      ))}
    </div>
  );
}