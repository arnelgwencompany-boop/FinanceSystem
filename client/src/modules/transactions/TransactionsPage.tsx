import { useState } from "react";
import { 
  Download, PlusCircle, TrendingUp, TrendingDown, 
  CloudUpload, Save, Search, Filter, Edit2, Trash2, 
  ChevronLeft, ChevronRight, Clock, CheckCircle 
} from "lucide-react";

type Transaction = {
  id: number;
  date: string;
  department: string;
  type: string;
  category: string;
  amount: number;
  description: string;
  status: string;
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, date: "2023-11-24", department: "IT Ops", type: "Expense", category: "Hardware", amount: 1240.00, description: "MacBook Pro M3 Pro - Asset ID: 9921", status: "Pending" },
    { id: 2, date: "2023-11-23", department: "Sales", type: "Income", category: "Software", amount: 5400.00, description: "Q4 Cloud Services Renewal", status: "Approved" },
    { id: 3, date: "2023-11-22", department: "Marketing", type: "Expense", category: "Other", amount: 850.00, description: "Conference Booth Graphics Print", status: "Approved" },
  ]);

  const [form, setForm] = useState({
    date: "",
    department: "",
    type: "Expense",
    category: "",
    amount: "",
    description: "",
  });

  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTransaction: Transaction = {
      id: Date.now(),
      date: form.date,
      department: form.department,
      type: form.type,
      category: form.category,
      amount: Number(form.amount),
      description: form.description,
      status: "Pending",
    };

    setTransactions([newTransaction, ...transactions]);
    setForm({ date: "", department: "", type: "Expense", category: "", amount: "", description: "" });
  };

  const handleDelete = (id: number) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const filteredTransactions = transactions.filter(t => 
    t.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="ml-[240px] mt-16 p-8 min-h-[calc(100vh-64px)] bg-[#f7f9fb]">
      <div className="max-w-[1440px] mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-[#00355f]">Transaction Ledger</h2>
            <p className="text-[14px] text-[#505f76] mt-1">Manage and record organizational financial movements and asset procurements.</p>
          </div>
          <button className="px-4 py-2 bg-white border border-[#c2c7d1] rounded text-[#505f76] font-semibold hover:bg-[#f2f4f6] transition-colors flex items-center gap-2 text-sm shadow-sm">
            <Download size={18} />
            Export CSV
          </button>
        </div>

        {/* Bento Layout Content */}
        <div className="grid grid-cols-12 gap-6 items-start">
          
          {/* Section 1: Add New Transaction Form */}
          <section className="col-span-12 xl:col-span-4 bg-white border border-[#c2c7d1] rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <PlusCircle className="text-[#00355f]" size={20} />
              <h3 className="text-lg font-semibold text-[#191c1e]">Add New Transaction</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold uppercase tracking-wide text-[#727780]">Date</label>
                  <input required type="date" name="date" value={form.date} onChange={handleChange} className="h-9 border border-[#c2c7d1] rounded px-3 text-[13px] focus:border-[#00355f] focus:ring-1 focus:ring-[#00355f] transition-all outline-none" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold uppercase tracking-wide text-[#727780]">Department</label>
                  <select required name="department" value={form.department} onChange={handleChange} className="h-9 border border-[#c2c7d1] rounded px-3 text-[13px] focus:border-[#00355f] focus:ring-1 focus:ring-[#00355f] transition-all outline-none bg-white">
                    <option value="">Select Dept</option>
                    <option value="IT Ops">IT Ops</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold uppercase tracking-wide text-[#727780]">Transaction Type</label>
                <div className="flex gap-4">
                  <label className={`flex-1 flex items-center justify-center gap-2 border rounded py-2 cursor-pointer transition-all ${form.type === "Income" ? "bg-[#0f4c81] text-[#8ebdf9] border-[#00355f]" : "border-[#c2c7d1] hover:bg-[#f2f4f6]"}`}>
                    <input type="radio" name="type" value="Income" checked={form.type === "Income"} onChange={handleChange} className="hidden" />
                    <TrendingUp size={16} />
                    <span className="text-[11px] font-bold uppercase tracking-wide">Income</span>
                  </label>
                  <label className={`flex-1 flex items-center justify-center gap-2 border rounded py-2 cursor-pointer transition-all ${form.type === "Expense" ? "bg-[#0f4c81] text-[#8ebdf9] border-[#00355f]" : "border-[#c2c7d1] hover:bg-[#f2f4f6]"}`}>
                    <input type="radio" name="type" value="Expense" checked={form.type === "Expense"} onChange={handleChange} className="hidden" />
                    <TrendingDown size={16} />
                    <span className="text-[11px] font-bold uppercase tracking-wide">Expense</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold uppercase tracking-wide text-[#727780]">Category</label>
                  <select required name="category" value={form.category} onChange={handleChange} className="h-9 border border-[#c2c7d1] rounded px-3 text-[13px] focus:border-[#00355f] focus:ring-1 focus:ring-[#00355f] transition-all outline-none bg-white">
                    <option value="">Select Cat</option>
                    <option value="Hardware">Hardware</option>
                    <option value="Software">Software</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-bold uppercase tracking-wide text-[#727780]">Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#727780] font-mono">$</span>
                    <input required type="number" name="amount" value={form.amount} onChange={handleChange} placeholder="0.00" step="0.01" className="w-full h-9 border border-[#c2c7d1] rounded pl-7 pr-3 text-[13px] font-mono text-right focus:border-[#00355f] focus:ring-1 focus:ring-[#00355f] transition-all outline-none" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold uppercase tracking-wide text-[#727780]">Description</label>
                <textarea required name="description" value={form.description} onChange={handleChange} placeholder="Reference procurement ID or item description..." rows={3} className="border border-[#c2c7d1] rounded p-3 text-[13px] focus:border-[#00355f] focus:ring-1 focus:ring-[#00355f] transition-all outline-none resize-none"></textarea>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold uppercase tracking-wide text-[#727780]">Attachments</label>
                <div className="border-2 border-dashed border-[#c2c7d1] rounded-lg p-6 flex flex-col items-center justify-center gap-2 hover:bg-[#f2f4f6] transition-all cursor-pointer">
                  <CloudUpload className="text-[#727780]" size={24} />
                  <p className="text-[13px] text-[#727780]">Click to <span className="text-[#00355f] font-bold">Browse</span> or drag files here</p>
                </div>
              </div>

              <button type="submit" className="w-full bg-[#00355f] text-white py-3 rounded font-semibold hover:bg-[#00355f]/90 transition-all shadow-sm flex items-center justify-center gap-2 mt-2">
                <Save size={18} />
                Save & Submit
              </button>
            </form>
          </section>

          {/* Section 2: Transaction List & Stats */}
          <section className="col-span-12 xl:col-span-8 space-y-6">
            
            {/* Search & Filter Bar */}
            <div className="bg-white border border-[#c2c7d1] rounded-lg shadow-sm p-4 flex flex-wrap gap-4 items-center">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#727780]" size={18} />
                <input 
                  type="text" 
                  placeholder="Filter descriptions, departments..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-9 border border-[#c2c7d1] rounded pl-10 pr-3 text-[13px] focus:border-[#00355f] focus:ring-1 focus:ring-[#00355f] outline-none" 
                />
              </div>
              <div className="flex gap-2">
                <select className="h-9 border border-[#c2c7d1] rounded px-3 text-[11px] font-bold uppercase tracking-wide text-[#505f76] bg-[#f2f4f6] outline-none cursor-pointer">
                  <option>All Departments</option>
                  <option>IT Ops</option>
                  <option>Marketing</option>
                </select>
                <button className="h-9 w-9 flex items-center justify-center border border-[#c2c7d1] rounded hover:bg-[#f2f4f6] transition-colors text-[#505f76]">
                  <Filter size={16} />
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-[#c2c7d1] rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#f2f4f6] border-b border-[#c2c7d1]">
                    <tr>
                      <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-[#505f76]">Date</th>
                      <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-[#505f76] text-center">Type</th>
                      <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-[#505f76]">Dept</th>
                      <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-[#505f76]">Category</th>
                      <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-[#505f76] text-right">Amount</th>
                      <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-[#505f76]">Description</th>
                      <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wide text-[#505f76] text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#c2c7d1]/50">
                    {filteredTransactions.map((t) => (
                      <tr key={t.id} className="hover:bg-[#F0F7FF] transition-colors group">
                        <td className="px-4 py-3 text-[12px] font-mono text-[#191c1e] whitespace-nowrap">{t.date}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${t.type === 'Income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {t.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[13px] text-[#191c1e]">{t.department}</td>
                        <td className="px-4 py-3 text-[13px] text-[#727780]">{t.category}</td>
                        <td className="px-4 py-3 text-[12px] font-mono text-right font-semibold text-[#191c1e]">${t.amount.toFixed(2)}</td>
                        <td className="px-4 py-3 text-[13px] text-[#191c1e] max-w-[200px] truncate">{t.description}</td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1 text-[#727780] hover:text-[#00355f] transition-colors"><Edit2 size={16} /></button>
                            <button onClick={() => handleDelete(t.id)} className="p-1 text-[#727780] hover:text-[#ba1a1a] transition-colors"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredTransactions.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-[13px] text-[#727780]">
                          No transactions found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className="px-4 py-3 bg-[#f2f4f6] border-t border-[#c2c7d1] flex justify-between items-center">
                <span className="text-[13px] text-[#727780]">Showing {filteredTransactions.length} entries</span>
                <div className="flex gap-1">
                  <button className="h-8 w-8 flex items-center justify-center border border-[#c2c7d1] rounded bg-white text-[#505f76] hover:bg-[#f7f9fb] transition-colors"><ChevronLeft size={16} /></button>
                  <button className="h-8 w-8 border border-[#00355f] rounded bg-[#00355f] text-white font-bold text-[13px]">1</button>
                  <button className="h-8 w-8 border border-[#c2c7d1] rounded bg-white text-[#505f76] hover:bg-[#f7f9fb] text-[13px]">2</button>
                  <button className="h-8 w-8 flex items-center justify-center border border-[#c2c7d1] rounded bg-white text-[#505f76] hover:bg-[#f7f9fb] transition-colors"><ChevronRight size={16} /></button>
                </div>
              </div>
            </div>

            {/* Statistics Summary Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-4 border border-[#c2c7d1] rounded-lg shadow-sm">
                <p className="text-[11px] font-bold uppercase tracking-wide text-[#727780] mb-1">Monthly Spend</p>
                <h4 className="text-xl font-bold text-[#ba1a1a]">$14,230.12</h4>
                <p className="text-[10px] text-[#ba1a1a] flex items-center gap-1 mt-1">
                  <TrendingUp size={12} /> 12% vs last month
                </p>
              </div>
              <div className="bg-white p-4 border border-[#c2c7d1] rounded-lg shadow-sm">
                <p className="text-[11px] font-bold uppercase tracking-wide text-[#727780] mb-1">Pending Approvals</p>
                <h4 className="text-xl font-bold text-[#00355f]">12 Items</h4>
                <p className="text-[10px] text-[#505f76] flex items-center gap-1 mt-1">
                  <Clock size={12} /> Average time: 4h
                </p>
              </div>
              <div className="bg-white p-4 border border-[#c2c7d1] rounded-lg shadow-sm">
                <p className="text-[11px] font-bold uppercase tracking-wide text-[#727780] mb-1">Total Assets Value</p>
                <h4 className="text-xl font-bold text-[#07497d]">$1.2M</h4>
                <p className="text-[10px] text-[#07497d] flex items-center gap-1 mt-1">
                  <CheckCircle size={12} /> Audit status: Current
                </p>
              </div>
            </div>

          </section>
        </div>
      </div>
    </main>
  );
}