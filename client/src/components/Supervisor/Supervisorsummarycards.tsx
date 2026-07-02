import { FileText, Clock, CheckCircle2, XCircle } from "lucide-react";
import { SummaryCard } from "../../components/approvedshared/Approvalshared";
import type { FilterTab } from "../../components/approvedshared/Approvalshared";

interface Counts {
  All: number;
  Pending: number;
  "Supervisor Approved": number;
  "Fully Approved": number;
  Rejected: number;
}

interface Props {
  counts: Counts;
  activeTab: FilterTab;
  onTabChange: (tab: FilterTab) => void;
}

export default function SupervisorSummaryCards({ counts, activeTab, onTabChange }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <SummaryCard
        label="Total"
        count={counts.All}
        active={activeTab === "All"}
        onClick={() => onTabChange("All")}
        icon={<FileText size={20} className="text-[#00355f]" />}
        color="bg-slate-100"
      />
      <SummaryCard
        label="Pending"
        count={counts.Pending}
        active={activeTab === "Pending"}
        onClick={() => onTabChange("Pending")}
        icon={<Clock size={20} className="text-amber-600" />}
        color="bg-amber-50"
      />
      <SummaryCard
        label="Fwd to Director"
        count={counts["Supervisor Approved"]}
        active={activeTab === "Supervisor Approved"}
        onClick={() => onTabChange("Supervisor Approved")}
        icon={<CheckCircle2 size={20} className="text-blue-600" />}
        color="bg-blue-50"
      />
      <SummaryCard
        label="Rejected"
        count={counts.Rejected}
        active={activeTab === "Rejected"}
        onClick={() => onTabChange("Rejected")}
        icon={<XCircle size={20} className="text-red-500" />}
        color="bg-red-50"
      />
    </div>
  );
}