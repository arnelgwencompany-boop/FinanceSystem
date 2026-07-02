import { Search } from "lucide-react";
import type { FilterTab } from "../../components/approvedshared/Approvalshared";

interface Counts {
  All: number;
  Pending: number;
  "Supervisor Approved": number;
  "Fully Approved": number;
  Rejected: number;
}

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  onTabChange: (tab: FilterTab) => void;
  counts: Counts;
}

export default function SupervisorFilterBar({
  search, onSearchChange,
}: Props) {
  return (
    <>
      {/* Search + filter toggle */}
      <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name or request number…"
            className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-200 rounded-xl text-[15px] text-[#1a2e3f] outline-none focus:border-[#00355f] focus:ring-4 focus:ring-[#00355f]/10 transition-all"
          />
        </div>
      </div>
    </>
  );
}