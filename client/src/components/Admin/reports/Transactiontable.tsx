import type { Transaction } from "../../../types/reports";

type Props = {
  data: Transaction[];
};

export default function TransactionTable({ data }: Props) {
  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-[#191c1e] border-b border-[#c2c7d1] pb-2">
        Detailed Transaction Records
      </h4>
      <div className="overflow-hidden border border-[#c2c7d1] rounded-xl bg-white">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#f2f4f6]">
            <tr>
              {["Date", "Description", "Category", "Amount"].map((h, i) => (
                <th
                  key={h}
                  className={`px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-[#505f76] border-b border-[#c2c7d1] ${i === 3 ? "text-right" : ""}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#c2c7d1]">
            {data.length > 0 ? (
              data.map((item) => (
                <tr key={item.id} className="hover:bg-[#f0f7ff] transition-colors">
                  <td className="px-4 py-3 text-[13px] font-mono text-[#505f76]">{item.date}</td>
                  <td className="px-4 py-3 text-[14px] text-[#191c1e] font-semibold">{item.description}</td>
                  <td className="px-4 py-3 text-[13px] text-[#505f76]">
                    <span className="px-2 py-1 bg-[#e0e3e5] rounded-full text-[10px] font-bold uppercase">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[13px] font-mono font-bold text-[#00355f] text-right">
                    ₱{item.amount.toFixed(2)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-[13px] text-[#727780]">
                  No transactions found for the selected date range.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}