const WEEKS = [
  { label: "W1", height: "40%", fill: "85%" },
  { label: "W2", height: "85%", fill: "92%" },
  { label: "W3", height: "60%", fill: "78%" },
  { label: "W4", height: "30%", fill: "70%" },
];

export default function WeeklyTrendChart() {
  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-[#191c1e] border-b border-[#c2c7d1] pb-2">
        Weekly Trend (Demo)
      </h4>
      <div className="h-48 flex items-end justify-between gap-2 px-2 pt-4">
        {WEEKS.map(({ label, height, fill }) => (
          <div key={label} className="flex-1 flex flex-col items-center gap-2">
            <div
              className="w-full bg-[#0f4c81]/20 rounded-t transition-all cursor-help hover:opacity-80"
              style={{ height }}
            >
              <div
                className="bg-[#00355f] w-full rounded-t"
                style={{ height: fill }}
              />
            </div>
            <span className="text-[10px] font-bold uppercase text-[#505f76]">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}