import type { DeptSpend } from "../../types/dashboard";

type Props = {
  data: DeptSpend[];
  period?: string;
};

const BAR_COLORS = [
  "bg-[#00355f]",
  "bg-[#0f4c81]",
  "bg-[#4a7fa5]",
  "bg-[#8ebdf9]",
];

export default function SpendingChart({ data, period = "Last 30 Days" }: Props) {
  return (
    <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-[#c2c7d1]">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-[15px] font-semibold text-[#00355f]">Spending by Department</h4>
        <span className="text-[11px] font-medium text-[#727780] bg-[#f2f4f6] px-3 py-1 rounded-full">
          {period}
        </span>
      </div>
      <div className="space-y-5">
        {data.map((d, i) => (
          <div key={d.label} className="space-y-1.5">
            <div className="flex justify-between items-baseline">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${BAR_COLORS[i % BAR_COLORS.length]}`} />
                <span className="text-[13px] font-bold text-[#191c1e]">{d.label}</span>
              </div>
              <span className="text-[13px] font-semibold text-[#505f76]">₱{d.amount}</span>
            </div>
            <div className="w-full h-2 bg-[#eceef0] rounded-full overflow-hidden">
              <div
                className={`h-full ${BAR_COLORS[i % BAR_COLORS.length]} rounded-full transition-all duration-500`}
                style={{ width: `${d.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}