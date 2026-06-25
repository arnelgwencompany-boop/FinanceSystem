import { ShieldCheck, Lock } from "lucide-react";

export default function ReportFooter() {
  return (
    <div className="mt-auto p-6 border-t border-[#c2c7d1] bg-[#f2f4f6] text-center">
      <p className="text-[13px] text-[#505f76]">
        This report was generated automatically. All values are calculated based on registered records.
        For audits, contact the Finance Department.
      </p>
      <div className="mt-4 flex justify-center gap-6 text-[#505f76]">
        <div className="flex items-center gap-1.5">
          <ShieldCheck size={16} />
          <span className="text-[11px] font-semibold tracking-wide">SYSTEM VERIFIED</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Lock size={16} />
          <span className="text-[11px] font-semibold tracking-wide">ENCRYPTED DATA</span>
        </div>
      </div>
    </div>
  );
}