import { 
  Plus, 
  Banknote, 
  ShoppingCart, 
  Landmark, 
  History, 
  List, 
  Filter, 
  MoreVertical, 
} from "lucide-react";

export default function DashboardPage() {
  // Mock Data mapped for the UI
  const summary = {
    income: "100,000.00",
    expenses: "42,415.00",
    balance: "57,585.00",
  };

  const transactions = [
    {
      id: 1,
      department: "GA",
      unit: "0",
      item: "1",
      date: "1/25/2024",
      description: "AWEI headphone set(20 pcs)",
      payOut: "2748.9",
      VAT: "252.4",
      withoutVAT: "2102.5",
      deliveryFee: "394",
      balance: "97251.10",
      status: "Completed",
      statusStyle: "bg-green-100 text-green-700 border-green-200",
    },
    {
      id: 2,
      department: "GO",
      unit: "0",
      item: "2",
      date: "1/11/2024",
      description: "Humidity Temperature(2 pcs)",
      payOut: "236.5",
      VAT: "0",
      withoutVAT: "178",
      deliveryFee: "58.5",
      balance: "97014.6",
      status: "Completed",
      statusStyle: "bg-green-100 text-green-700 border-green-200",
    },
    {
      id: 3,
      department: "IE",
      unit: "0",
      item: "3",
      date: "3/25/2024",
      description: "mouse pad(20 pcs)",
      payOut: "236.5",
      VAT: "0",
      withoutVAT: "178",
      deliveryFee: "58.5",
      balance: "97014.6",
      status: "Completed",
      statusStyle: "bg-green-100 text-green-700 border-green-200",
    },
  ];

  return (
    <div className="font-sans text-[#191c1e] bg-[#F8FAFC] min-h-screen flex">
      {/* Main Content */}
      <main className="ml-[240px] pt-24 px-8 pb-8 w-full">
        
        {/* Welcome Header */}
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-[24px] font-semibold text-[#00355f]">Financial Overview</h2>
            <p className="text-[#505f76] text-[14px] mt-1">Real-time tracking of IT operational expenditures and hardware assets.</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1 px-6 py-2 bg-[#0f4c81] text-[#8ebdf9] font-bold rounded-lg hover:opacity-90 shadow-sm transition-all active:scale-95 text-[11px] uppercase tracking-wider">
              <Plus size={16} />
              New Transaction
            </button>
          </div>
        </div>

        {/* Summary Cards (Bento Style) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          
          <div className="bg-white p-6 rounded-xl border border-[#c2c7d1] hover:border-[#00355f]/50 transition-colors group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded bg-[#00355f]/5 text-[#00355f]">
                <Banknote size={20} />
              </div>
              <span className="text-[10px] font-bold text-[#6f3800] bg-[#ffdcc4] px-2 py-0.5 rounded-full">+12.4%</span>
            </div>
            <p className="text-[11px] font-bold text-[#505f76] mb-1 uppercase tracking-wider">Total Income</p>
            <h3 className="text-[20px] font-extrabold text-[#191c1e]">{summary.income}</h3>
            <div className="mt-4 w-full h-1 bg-[#eceef0] rounded-full overflow-hidden">
              <div className="h-full bg-[#0f4c81] w-[75%]"></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#c2c7d1] hover:border-[#ba1a1a]/50 transition-colors group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded bg-[#ba1a1a]/5 text-[#ba1a1a]">
                <ShoppingCart size={20} />
              </div>
              <span className="text-[10px] font-bold text-[#93000a] bg-[#ffdad6] px-2 py-0.5 rounded-full">+4.1%</span>
            </div>
            <p className="text-[11px] font-bold text-[#505f76] mb-1 uppercase tracking-wider">Total Expenses</p>
            <h3 className="text-[20px] font-extrabold text-[#191c1e]">{summary.expenses}</h3>
            <div className="mt-4 w-full h-1 bg-[#eceef0] rounded-full overflow-hidden">
              <div className="h-full bg-[#ba1a1a] w-[60%]"></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#c2c7d1] hover:border-[#07497d] transition-colors group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded bg-[#d0e1fb] text-[#00355f]">
                <Landmark size={20} />
              </div>
              <span className="text-[10px] font-bold text-[#38485d] bg-[#d3e4fe] px-2 py-0.5 rounded-full">Stable</span>
            </div>
            <p className="text-[11px] font-bold text-[#505f76] mb-1 uppercase tracking-wider">Total Balance</p>
            <h3 className="text-[20px] font-extrabold text-[#191c1e]">{summary.balance}</h3>
            <div className="mt-4 w-full h-1 bg-[#eceef0] rounded-full overflow-hidden">
              <div className="h-full bg-[#07497d] w-[90%]"></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#c2c7d1] hover:border-[#f9a767] transition-colors group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded bg-[#ffdcc4] text-[#6f3800]">
                <History size={20} />
              </div>
            </div>
            <p className="text-[11px] font-bold text-[#505f76] mb-1 uppercase tracking-wider">Recent Activity</p>
            <h3 className="text-[20px] font-extrabold text-[#191c1e]">24 Action Items</h3>
            <p className="mt-2 text-[13px] text-[#505f76]">3 hardware requests pending approval.</p>
          </div>

        </div>

        {/* Latest Transactions Table */}
        <section className="bg-white rounded-xl border border-[#c2c7d1] overflow-hidden shadow-sm">
          <div className="p-6 border-b border-[#c2c7d1] flex justify-between items-center bg-[#f2f4f6]">
            <div className="flex items-center gap-2">
              <List size={20} className="text-[#00355f]" />
              <h3 className="text-[16px] font-semibold text-[#00355f]">Latest Transactions</h3>
            </div>
            <div className="flex gap-1">
              <button className="p-1 text-[#505f76] hover:text-[#00355f] transition-colors">
                <Filter size={18} />
              </button>
              <button className="p-1 text-[#505f76] hover:text-[#00355f] transition-colors">
                <MoreVertical size={18} />
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
            <tr className="bg-[#f7f9fb] border-b border-[#c2c7d1]">
              <th className="p-3 text-xs">Date</th>
              <th className="p-3 text-xs">Department</th>
    
              <th className="p-3 text-xs">Unit</th>
              <th className="p-3 text-xs">Item</th>
              <th className="p-3 text-xs">Description</th>
              <th className="p-3 text-xs text-right">Pay Out</th>
              <th className="p-3 text-xs text-right">VAT</th>
              <th className="p-3 text-xs text-right">Without VAT</th>
              <th className="p-3 text-xs text-right">Delivery</th>
              <th className="p-3 text-xs text-right">Balance</th>
              <th className="p-3 text-xs text-center">Status</th>
            </tr>
          </thead>
               <tbody>
            {transactions.map((t) => {
              return (
                <tr
                  key={t.id}
                  className="hover:bg-[#F0F7FF] transition-colors group"
                >
                  <td className="p-3">{t.date}</td>

                  <td className="p-3 font-semibold text-[#00355f]">
                    {t.department}
                  </td>
                  <td className="p-3">{t.unit}</td>
                  <td className="p-3">{t.item}</td>
                  <td className="p-3">{t.description}</td>
                  <td className="p-3 text-right text-red-600 font-bold">
                    {t.payOut}
                  </td>

                  <td className="p-3 text-right">{t.VAT}</td>
                  <td className="p-3 text-right">{t.withoutVAT}</td>
                  <td className="p-3 text-right">{t.deliveryFee}</td>
                  <td className="p-3 text-right font-semibold">
                    {t.balance}
                  </td>

                  <td className="p-3 text-center">
                    <span
                      className={`px-2 py-1 text-xs rounded border ${t.statusStyle}`}
                    >
                      {t.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
            </table>
          </div>
          
          <div className="p-4 flex justify-between items-center bg-[#f2f4f6] border-t border-[#c2c7d1]">
            <p className="text-[13px] text-[#505f76]">Showing 1 to 5 of 42 transactions</p>
            <div className="flex gap-1">
              <button className="px-3 py-1 border border-[#c2c7d1] rounded bg-white text-[13px] hover:bg-[#e0e3e5] transition-colors opacity-50 cursor-not-allowed">Previous</button>
              <button className="px-3 py-1 border border-[#c2c7d1] rounded bg-[#0f4c81] text-[#8ebdf9] font-bold text-[13px]">1</button>
              <button className="px-3 py-1 border border-[#c2c7d1] rounded bg-white text-[13px] hover:bg-[#e0e3e5] transition-colors">2</button>
              <button className="px-3 py-1 border border-[#c2c7d1] rounded bg-white text-[13px] hover:bg-[#e0e3e5] transition-colors">Next</button>
            </div>
          </div>
        </section>

        {/* Data Visualization Glimpse (Bento Grid Continued) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-8">
          
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-[#c2c7d1]">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-[16px] font-semibold text-[#00355f]">Spending by Department</h4>
              <span className="text-[13px] text-[#505f76]">Last 30 Days</span>
            </div>
            {/* Simple Simulated Bar Chart */}
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-[13px] font-bold text-[#191c1e]">
                  <span>GA</span>
                  <span>$42,800</span>
                </div>
                <div className="w-full h-2 bg-[#eceef0] rounded-full">
                  <div className="h-full bg-[#00355f] rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[13px] font-bold text-[#191c1e]">
                  <span>GO</span>
                  <span>$18,400</span>
                </div>
                <div className="w-full h-2 bg-[#eceef0] rounded-full">
                  <div className="h-full bg-[#00355f] rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[13px] font-bold text-[#191c1e]">
                  <span>IE</span>
                  <span>$12,100</span>
                </div>
                <div className="w-full h-2 bg-[#eceef0] rounded-full">
                  <div className="h-full bg-[#00355f] rounded-full" style={{ width: '32%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}