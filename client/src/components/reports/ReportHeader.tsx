import { FileText, Printer } from "lucide-react";

type Props = {
  onPrint: () => void;
};

export default function ReportsHeader({ onPrint }: Props) {
  return (
    <div className="flex justify-between items-end">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#4a7fa5] mb-1">Finance</p>
        <h2 className="text-2xl font-bold text-[#00355f]">Financial Reporting</h2>
        <p className="text-[14px] text-[#505f76] mt-1">
          Analyze expenditure and departmental financial metrics.
        </p>
      </div>
      <div className="flex gap-2">
        <button className="px-4 py-2 bg-white border border-[#c2c7d1] text-[#505f76] rounded-lg text-[11px] font-bold uppercase tracking-wide flex items-center gap-2 hover:bg-[#f2f4f6] transition-colors shadow-sm">
          <FileText size={16} />
          Export to Word
        </button>
        <button
          onClick={onPrint}
          className="px-4 py-2 bg-white border border-[#c2c7d1] text-[#505f76] rounded-lg text-[11px] font-bold uppercase tracking-wide flex items-center gap-2 hover:bg-[#f2f4f6] transition-colors shadow-sm"
        >
          <Printer size={16} />
          Print PDF
        </button>
      </div>
    </div>
  );
}