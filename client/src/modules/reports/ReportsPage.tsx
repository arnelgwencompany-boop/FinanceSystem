import { useState, useMemo } from 'react';
import { 
  FileText, Printer, RefreshCw, Wallet, 
  TrendingUp, Clock, ShieldCheck, Lock 
} from 'lucide-react';

type Transaction = {
  id: number;
  date: string;
  description: string;
  amount: number;
  category: string;
};

const mockData: Transaction[] = [
  { id: 1, date: '2026-06-01', description: 'Office Supplies', amount: 500, category: 'Supplies' },
  { id: 2, date: '2026-06-03', description: 'Snacks', amount: 300, category: 'Food' },
  { id: 3, date: '2026-06-05', description: 'Transport', amount: 200, category: 'Travel' },
  { id: 4, date: '2026-06-10', description: 'Printer Ink', amount: 700, category: 'Supplies' },
];

export default function Reports() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredData = useMemo(() => {
    return mockData.filter((item) => {
      if (!startDate || !endDate) return true;
      return item.date >= startDate && item.date <= endDate;
    });
  }, [startDate, endDate]);

  const totalAmount = useMemo(() => {
    return filteredData.reduce((sum, item) => sum + item.amount, 0);
  }, [filteredData]);

  const groupedByCategory = useMemo(() => {
    const grouped: Record<string, number> = {};
    filteredData.forEach((item) => {
      grouped[item.category] = (grouped[item.category] || 0) + item.amount;
    });
    return grouped;
  }, [filteredData]);

  // Utility to get a color block for the category legend
  const getCategoryColor = (index: number) => {
    const colors = ['bg-[#00355f]', 'bg-[#743b00]', 'bg-[#e0e3e5]', 'bg-[#0f4c81]'];
    return colors[index % colors.length];
  };

  return (
    <main className="ml-[240px] mt-16 p-8 min-h-[calc(100vh-64px)] bg-[#f7f9fb]">
      <div className="max-w-[1440px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-[#00355f]">Financial Reporting</h2>
            <p className="text-[14px] text-[#505f76] mt-1">Analyze expenditure and departmental financial metrics.</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-[#c2c7d1] text-[#505f76] rounded text-[11px] font-bold uppercase tracking-wide flex items-center gap-2 hover:bg-[#f2f4f6] transition-colors shadow-sm">
              <FileText size={18} />
              Export to Word
            </button>
            <button className="px-4 py-2 bg-white border border-[#c2c7d1] text-[#505f76] rounded text-[11px] font-bold uppercase tracking-wide flex items-center gap-2 hover:bg-[#f2f4f6] transition-colors shadow-sm">
              <Printer size={18} />
              Print PDF
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        <div className="bg-white border border-[#c2c7d1] rounded-lg p-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-end shadow-sm">
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wide text-[#505f76] block">Start Date</label>
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full h-9 border border-[#c2c7d1] rounded bg-white px-3 text-[13px] focus:ring-1 focus:ring-[#00355f] focus:border-[#00355f] outline-none transition-colors"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wide text-[#505f76] block">End Date</label>
            <input 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full h-9 border border-[#c2c7d1] rounded bg-white px-3 text-[13px] focus:ring-1 focus:ring-[#00355f] focus:border-[#00355f] outline-none transition-colors"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wide text-[#505f76] block">Category Filter</label>
            <select className="w-full h-9 border border-[#c2c7d1] rounded bg-white px-3 text-[13px] focus:ring-1 focus:ring-[#00355f] focus:border-[#00355f] outline-none transition-colors">
              <option>All Categories</option>
              <option>Supplies</option>
              <option>Food</option>
              <option>Travel</option>
            </select>
          </div>
          <div>
            <button className="w-full h-9 bg-[#00355f] text-white text-[11px] font-bold uppercase tracking-wide rounded flex items-center justify-center gap-2 hover:bg-[#0f4c81] transition-colors active:scale-[0.98] shadow-sm">
              <RefreshCw size={16} />
              Refresh Data
            </button>
          </div>
        </div>

        {/* Report Preview Section */}
        <div className="bg-white border border-[#c2c7d1] rounded-lg shadow-sm min-h-[800px] flex flex-col overflow-hidden">
          
          {/* Report Header */}
          <div className="p-8 border-b border-[#c2c7d1] flex justify-between items-start bg-[#ffffff]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#00355f] rounded flex items-center justify-center shadow-sm">
                <Wallet className="text-white" size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#191c1e]">Expenditure Performance Report</h3>
                <p className="text-[13px] text-[#505f76] mt-1">Generated dynamically | Ref: EXP-RPT-{new Date().getFullYear()}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-bold uppercase tracking-wide text-[#00355f]">Confidential</p>
              <p className="text-[13px] text-[#505f76] mt-1">Active Period: Current</p>
            </div>
          </div>

          {/* Report Body */}
          <div className="p-8 space-y-8 flex-1">
            
            {/* Summary KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-[#f2f4f6] border border-[#c2c7d1] rounded shadow-sm">
                <p className="text-[11px] font-bold uppercase tracking-wide text-[#505f76] mb-1">Total Expenses</p>
                <p className="text-2xl font-bold text-[#00355f]">₱{totalAmount.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-2 text-green-700">
                  <TrendingUp size={14} />
                  <span className="text-[12px] font-bold">Based on filtered range</span>
                </div>
              </div>
              <div className="p-4 bg-[#f2f4f6] border border-[#c2c7d1] rounded shadow-sm">
                <p className="text-[11px] font-bold uppercase tracking-wide text-[#505f76] mb-1">Average Transaction</p>
                <p className="text-2xl font-bold text-[#00355f]">
                  ₱{filteredData.length > 0 ? (totalAmount / filteredData.length).toFixed(2) : "0.00"}
                </p>
                <div className="flex items-center gap-1 mt-2 text-[#505f76]">
                  <Clock size={14} />
                  <span className="text-[12px] font-bold">Across {filteredData.length} records</span>
                </div>
              </div>
              <div className="p-4 bg-[#f2f4f6] border border-[#c2c7d1] rounded shadow-sm">
                <p className="text-[11px] font-bold uppercase tracking-wide text-[#505f76] mb-1">Budget Utilization</p>
                <p className="text-2xl font-bold text-[#00355f]">₱15,000.00</p>
                <div className="w-full bg-[#c2c7d1] h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-[#00355f] h-full" style={{ width: `${Math.min((totalAmount / 15000) * 100, 100)}%` }}></div>
                </div>
                <p className="text-[12px] mt-1 text-[#505f76]">
                  {((totalAmount / 15000) * 100).toFixed(1)}% utilized of monthly budget
                </p>
              </div>
            </div>

            {/* Charts and Visual Data */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Fake Bar Chart (Visual Only) */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-[#191c1e] border-b border-[#c2c7d1] pb-2">Weekly Trend (Demo)</h4>
                <div className="h-48 flex items-end justify-between gap-2 px-2 pt-4">
                  <div className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-[#0f4c81]/20 rounded-t h-[40%] hover:h-[45%] transition-all cursor-help">
                      <div className="bg-[#00355f] w-full h-[85%] rounded-t"></div>
                    </div>
                    <span className="text-[10px] font-bold uppercase text-[#505f76]">W1</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-[#0f4c81]/20 rounded-t h-[85%] hover:h-[90%] transition-all cursor-help">
                      <div className="bg-[#00355f] w-full h-[92%] rounded-t"></div>
                    </div>
                    <span className="text-[10px] font-bold uppercase text-[#505f76]">W2</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-[#0f4c81]/20 rounded-t h-[60%] hover:h-[65%] transition-all cursor-help">
                      <div className="bg-[#00355f] w-full h-[78%] rounded-t"></div>
                    </div>
                    <span className="text-[10px] font-bold uppercase text-[#505f76]">W3</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-[#0f4c81]/20 rounded-t h-[30%] hover:h-[35%] transition-all cursor-help">
                      <div className="bg-[#00355f] w-full h-[70%] rounded-t"></div>
                    </div>
                    <span className="text-[10px] font-bold uppercase text-[#505f76]">W4</span>
                  </div>
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-[#191c1e] border-b border-[#c2c7d1] pb-2">Expenses by Category</h4>
                <div className="flex items-center justify-center gap-8 h-48">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <path className="text-[#e0e3e5]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="100, 100" strokeWidth="3"></path>
                      <path className="text-[#00355f]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="60, 100" strokeWidth="3"></path>
                      <path className="text-[#743b00]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="25, 100" strokeDashoffset="-60" strokeWidth="3"></path>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-lg font-bold text-[#00355f]">100%</span>
                      <span className="text-[9px] font-bold uppercase text-[#505f76]">Tracked</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(groupedByCategory).length > 0 ? (
                      Object.entries(groupedByCategory).map(([category, amount], index) => (
                        <div key={category} className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getCategoryColor(index)}`}></div>
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
            </div>

            {/* Detailed Table */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-[#191c1e] border-b border-[#c2c7d1] pb-2">Detailed Transaction Records</h4>
              <div className="overflow-hidden border border-[#c2c7d1] rounded bg-white">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#f2f4f6]">
                    <tr>
                      <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-[#505f76] border-b border-[#c2c7d1]">Date</th>
                      <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-[#505f76] border-b border-[#c2c7d1]">Description</th>
                      <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-[#505f76] border-b border-[#c2c7d1]">Category</th>
                      <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-[#505f76] border-b border-[#c2c7d1] text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#c2c7d1]">
                    {filteredData.length > 0 ? (
                      filteredData.map((item) => (
                        <tr key={item.id} className="hover:bg-[#F0F7FF] transition-colors">
                          <td className="px-4 py-3 text-[13px] font-mono text-[#505f76]">{item.date}</td>
                          <td className="px-4 py-3 text-[14px] text-[#191c1e] font-semibold">{item.description}</td>
                          <td className="px-4 py-3 text-[13px] text-[#505f76]">
                            <span className="px-2 py-1 bg-[#e0e3e5] rounded-full text-[10px] font-bold uppercase">{item.category}</span>
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

          </div>

          {/* Report Footer */}
          <div className="mt-auto p-6 border-t border-[#c2c7d1] bg-[#f2f4f6] text-center">
            <p className="text-[13px] text-[#505f76]">
              This report was generated automatically. All values are calculated based on registered records. For audits, contact Finance Department.
            </p>
            <div className="mt-4 flex justify-center gap-6 text-[#505f76]">
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={16} />
                <span className="text-[11px] font-semibold tracking-wide">SYSTEM VERIFIED</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Lock size={16} />
                <span className="text-[11px] font-semibold tracking-wide">ENCRYPTED DATA</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}