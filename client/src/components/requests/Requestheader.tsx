import { Printer, FileText } from "lucide-react";

type Props = {
  onPrint: () => void;
};

export default function RequestHeader({ onPrint }: Props) {
  return (
    <div className="flex justify-between items-end">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#4a7fa5] mb-1">
          Finance
        </p>
        <h2 className="text-2xl font-bold text-[#00355f] leading-tight">
          Payment Request
        </h2>
        <p className="text-[13px] text-[#505f76] mt-1">
          Generate and print a payment request form from selected transactions.
        </p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onPrint}
          className="flex items-center gap-2 px-4 py-2 bg-[#00355f] text-white rounded-lg text-[11px] font-bold uppercase tracking-wide hover:bg-[#002542] transition-colors shadow-sm active:scale-[0.98]"
        >
          <Printer size={16} />
          Print Form
        </button>
        <button
          onClick={onPrint}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-[#c2c7d1] text-[#505f76] rounded-lg text-[11px] font-bold uppercase tracking-wide hover:bg-[#f2f4f6] transition-colors shadow-sm"
        >
          <FileText size={16} />
          Save as PDF
        </button>
      </div>
    </div>
  );
}