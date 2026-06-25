import { Wallet } from "lucide-react";
import type { Transaction } from "../../../types/reports";
import KpiCards from "./Kpicards";
import WeeklyTrendChart from "./Weeklytrendchart ";
import CategoryBreakdown from "./Categorybreakdown ";
import TransactionTable from "./Transactiontable";
import ReportFooter from "./Reportfooter";
import { MONTHLY_BUDGET } from "../../../data/reportData";

type Props = {
  filteredData: Transaction[];
  totalAmount: number;
  groupedByCategory: Record<string, number>;
  printRef: React.RefObject<HTMLDivElement>;
};

export default function ReportPreview({
  filteredData, totalAmount, groupedByCategory, printRef,
}: Props) {
  return (
    <div
      ref={printRef}
      className="bg-white border border-[#c2c7d1] rounded-xl shadow-sm min-h-[800px] flex flex-col overflow-hidden"
    >
      {/* Report document header */}
      <div className="p-8 border-b border-[#c2c7d1] flex justify-between items-start bg-white">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#00355f] rounded-lg flex items-center justify-center shadow-sm">
            <Wallet className="text-white" size={26} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#191c1e]">Expenditure Performance Report</h3>
            <p className="text-[13px] text-[#505f76] mt-1">
              Generated dynamically | Ref: EXP-RPT-{new Date().getFullYear()}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[11px] font-bold uppercase tracking-wide text-[#00355f]">Confidential</p>
          <p className="text-[13px] text-[#505f76] mt-1">Active Period: Current</p>
        </div>
      </div>

      {/* Report body */}
      <div className="p-8 space-y-8 flex-1">
        <KpiCards
          totalAmount={totalAmount}
          recordCount={filteredData.length}
          budget={MONTHLY_BUDGET}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <WeeklyTrendChart />
          <CategoryBreakdown groupedByCategory={groupedByCategory} />
        </div>

        <TransactionTable data={filteredData} />
      </div>

      <ReportFooter />
    </div>
  );
}