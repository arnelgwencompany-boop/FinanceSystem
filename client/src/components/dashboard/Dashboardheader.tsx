import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DashboardHeader() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-end mb-6">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#4a7fa5] mb-1">
          Overview
        </p>
        <h2 className="text-[24px] font-semibold text-[#00355f] leading-tight">
          Financial Overview
        </h2>
        <p className="text-[#505f76] text-[13px] mt-1">
          Real-time tracking of IT operational expenditures and hardware assets.
        </p>
      </div>
      <button
        onClick={() => navigate("/transactions")}
        className="flex items-center gap-2 px-5 py-2.5 bg-[#0f4c81] text-[#8ebdf9] font-bold rounded-lg hover:bg-[#00355f] shadow-sm transition-all active:scale-95 text-[11px] uppercase tracking-wider"
      >
        <Plus size={15} />
        New Transaction
      </button>
    </div>
  );
}