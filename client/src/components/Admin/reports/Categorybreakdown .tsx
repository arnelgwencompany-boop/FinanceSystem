import { CATEGORY_COLORS } from "../../../data/reportData";

type Props = {
  groupedByCategory: Record<string, number>;
};

export default function CategoryBreakdown({ groupedByCategory }: Props) {
  const entries = Object.entries(groupedByCategory);

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-[#191c1e] border-b border-[#c2c7d1] pb-2">
        Expenses by Category
      </h4>
      <div className="flex items-center justify-center gap-8 h-48">
        {/* Donut SVG */}
        <div className="relative w-32 h-32 shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-[#e0e3e5]"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeDasharray="100, 100"
              strokeWidth="3"
            />
            <path
              className="text-[#00355f]"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeDasharray="60, 100"
              strokeWidth="3"
            />
            <path
              className="text-[#743b00]"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeDasharray="25, 100"
              strokeDashoffset="-60"
              strokeWidth="3"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold text-[#00355f]">100%</span>
            <span className="text-[9px] font-bold uppercase text-[#505f76]">Tracked</span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2">
          {entries.length > 0 ? (
            entries.map(([category, amount], index) => (
              <div key={category} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${CATEGORY_COLORS[index % CATEGORY_COLORS.length]}`} />
                <span className="text-[13px] text-[#191c1e] font-medium">
                  {category} (₱{amount.toLocaleString()})
                </span>
              </div>
            ))
          ) : (
            <span className="text-[13px] text-[#727780]">No category data available</span>
          )}
        </div>
      </div>
    </div>
  );
}