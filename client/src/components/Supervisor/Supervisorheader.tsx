import { CheckCheck, Clock } from "lucide-react";

interface Props {
  pendingCount: number;
}

export default function SupervisorHeader({ pendingCount }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
       <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[#00355f]">
          <CheckCheck size={22} color="white" />
        </div>
        <div>
          <h1 className="text-[24px] font-extrabold text-[#00355f] leading-tight">
            Supervisor Approval Dashboard
          </h1>
          <p className="text-[15px] text-slate-500 mt-0.5">
            Review pending requests and forward approved ones to the Director.
          </p>
        </div>
      </div>

      {pendingCount > 0 && (
        <div className="flex items-center gap-3 px-5 py-3.5 rounded-xl border border-amber-200 bg-amber-50">
          <Clock size={18} className="text-amber-600 flex-shrink-0" />
          <p className="text-[15px] font-semibold text-amber-800">
            You have <span className="font-extrabold">{pendingCount}</span>{" "}
            pending request{pendingCount > 1 ? "s" : ""} awaiting your approval.
          </p>
        </div>
      )}
    </div>
  );
}