import { Download } from "lucide-react";
import type { Transaction } from "../../../types/transactions";
import Papa from "papaparse";

type Props = {
  transactions: Transaction[];
};

export default function PageHeader({ transactions }: Props) {
  const handleExport = () => {
    const csv = Papa.unparse(transactions);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex justify-between items-end">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-[#4a7fa5] mb-1">
          Finance
        </p>
        <h2 className="text-2xl font-bold text-[#00355f] leading-tight">
          Transaction Ledger
        </h2>
        <p className="text-[13px] text-[#505f76] mt-1">
          Track financial movements and asset procurements across departments.
        </p>
      </div>
      <button
        onClick={handleExport}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-[#c2c7d1] rounded-lg text-[#505f76] font-semibold hover:bg-[#f2f4f6] transition-colors text-sm shadow-sm"
      >
        <Download size={16} />
        Export CSV
      </button>
    </div>
  );
}