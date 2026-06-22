import { Banknote, ShoppingCart, Landmark, History } from "lucide-react";
import type { DashboardSummary } from "../../types/dashboard";

type Props = {
  summary: DashboardSummary;
  activityCount?: number;
  pendingCount?: number;
};

export default function SummaryCards({
  summary,
  activityCount = 24,
  pendingCount = 3,
}: Props) {
  const cards = [
    {
      label: "Total Income",
      value: `₱${summary.income}`,
      badge: "+12.4%",
      badgeColor: "text-[#6f3800] bg-[#ffdcc4]",
      icon: <Banknote size={20} />,
      iconBg: "bg-[#00355f]/5 text-[#00355f]",
      bar: "bg-[#0f4c81]",
      barWidth: "75%",
      hoverBorder: "hover:border-[#00355f]/50",
    },
    {
      label: "Total Expenses",
      value: `₱${summary.expenses}`,
      badge: "+4.1%",
      badgeColor: "text-[#93000a] bg-[#ffdad6]",
      icon: <ShoppingCart size={20} />,
      iconBg: "bg-[#ba1a1a]/5 text-[#ba1a1a]",
      bar: "bg-[#ba1a1a]",
      barWidth: "60%",
      hoverBorder: "hover:border-[#ba1a1a]/50",
    },
    {
      label: "Total Balance",
      value: `₱${summary.balance}`,
      badge: "Stable",
      badgeColor: "text-[#38485d] bg-[#d3e4fe]",
      icon: <Landmark size={20} />,
      iconBg: "bg-[#d0e1fb] text-[#00355f]",
      bar: "bg-[#07497d]",
      barWidth: "90%",
      hoverBorder: "hover:border-[#07497d]",
    },
    {
      label: "Recent Activity",
      value: `${activityCount} Action Items`,
      badge: null,
      sub: `${pendingCount} hardware requests pending approval.`,
      icon: <History size={20} />,
      iconBg: "bg-[#ffdcc4] text-[#6f3800]",
      bar: null,
      hoverBorder: "hover:border-[#f9a767]",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`bg-white p-6 rounded-xl border border-[#c2c7d1] ${card.hoverBorder} transition-colors group`}
        >
          <div className="flex justify-between items-start mb-4">
            <div className={`p-2 rounded ${card.iconBg}`}>
              {card.icon}
            </div>
            {card.badge && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${card.badgeColor}`}>
                {card.badge}
              </span>
            )}
          </div>
          <p className="text-[11px] font-bold text-[#505f76] mb-1 uppercase tracking-wider">
            {card.label}
          </p>
          <h3 className="text-[20px] font-extrabold text-[#191c1e]">{card.value}</h3>
          {card.bar ? (
            <div className="mt-4 w-full h-1 bg-[#eceef0] rounded-full overflow-hidden">
              <div className={`h-full ${card.bar} rounded-full`} style={{ width: card.barWidth }} />
            </div>
          ) : (
            <p className="mt-2 text-[13px] text-[#505f76]">{card.sub}</p>
          )}
        </div>
      ))}
    </div>
  );
}