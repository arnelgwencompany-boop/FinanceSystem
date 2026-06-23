import { RefreshCw } from "lucide-react";

type Props = {
  startDate: string;
  endDate: string;
  category: string;
  onStartDate: (v: string) => void;
  onEndDate: (v: string) => void;
  onCategory: (v: string) => void;
  onRefresh: () => void;
};

const CATEGORIES = ["All Categories", "Supplies", "Food", "Travel"];

const inputClass =
  "w-full h-9 border border-[#c2c7d1] rounded-lg bg-white px-3 text-[13px] focus:ring-1 focus:ring-[#00355f] focus:border-[#00355f] outline-none transition-colors";

const labelClass =
  "text-[11px] font-bold uppercase tracking-wide text-[#505f76] block mb-1";

export default function FilterPanel({
  startDate, endDate, category,
  onStartDate, onEndDate, onCategory, onRefresh,
}: Props) {
  return (
    <div className="bg-white border border-[#c2c7d1] rounded-xl p-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-end shadow-sm">
      <div>
        <label className={labelClass}>Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => onStartDate(e.target.value)}
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>End Date</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => onEndDate(e.target.value)}
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>Category Filter</label>
        <select
          value={category}
          onChange={(e) => onCategory(e.target.value)}
          className={inputClass}
        >
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>
      <div>
        <button
          onClick={onRefresh}
          className="w-full h-9 bg-[#00355f] text-white text-[11px] font-bold uppercase tracking-wide rounded-lg flex items-center justify-center gap-2 hover:bg-[#0f4c81] transition-colors active:scale-[0.98] shadow-sm"
        >
          <RefreshCw size={15} />
          Refresh Data
        </button>
      </div>
    </div>
  );
}