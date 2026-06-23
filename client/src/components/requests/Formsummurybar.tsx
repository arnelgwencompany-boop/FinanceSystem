import type { Transaction } from "../../types/requests";

type Props = {
  transactions: Transaction[];
  withheldAmount: number;
};

export default function FormSummaryBar({ transactions, withheldAmount }: Props) {
  const totalPayOut = transactions.reduce((s, t) => s + t.payOut, 0);
  const netAmount = totalPayOut - (withheldAmount || 0);

  function fmt(n: number) {
    return n.toLocaleString("en-PH", { minimumFractionDigits: 2 });
  }

  const items = [
    { label: "Items selected", value: `${transactions.length}`, color: "text-[#00355f]" },
    { label: "Total Pay Out", value: `₱${fmt(totalPayOut)}`, color: "text-[#ba1a1a]" },
    { label: "Withheld", value: withheldAmount > 0 ? `–₱${fmt(withheldAmount)}` : "—", color: "text-[#727780]" },
    { label: "Net Amount", value: `₱${fmt(netAmount)}`, color: "text-emerald-700" },
  ];

  return (
    <div className="bg-white border border-[#c2c7d1] rounded-xl shadow-sm px-6 py-3 grid grid-cols-4 gap-4 divide-x divide-[#c2c7d1]">
      {items.map((item) => (
        <div key={item.label} className="pl-4 first:pl-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#727780]">{item.label}</p>
          <p className={`text-[16px] font-extrabold mt-0.5 ${item.color}`}>{item.value}</p>
        </div>
      ))}
    </div>
  );
}