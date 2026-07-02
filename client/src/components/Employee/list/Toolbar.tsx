import { Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { FilterStatus } from "../../../types/requestList";

interface Props {
  query: string;
  onQuery: (v: string) => void;
  filter: FilterStatus;
  onFilter: (v: FilterStatus) => void;
}

const FILTERS: { label: string; value: FilterStatus }[] = [
  { label: "All",      value: "all"      },
  { label: "Pending",  value: "pending"  },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

export default function Toolbar({ query, onQuery, filter, onFilter }: Props) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="relative min-w-[200px] flex-1">
        <Search
          size={15}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
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
            onClick={() => onFilter(f.value)}
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

      {/* New request */}
      <button
        type="button"
        onClick={() => navigate("/request")}
        className="flex flex-shrink-0 items-center gap-2 rounded-xl bg-[#00355f] px-4 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-[#0f4c81]"
      >
        <Plus size={16} /> New request
      </button>
    </div>
  );
}