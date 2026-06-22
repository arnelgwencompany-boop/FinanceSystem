import { useState } from "react";
import { 
  Download, PlusCircle, TrendingUp, 
  Search, Filter, Edit2, Trash2, 
  ChevronLeft, ChevronRight, Clock, CheckCircle 
} from "lucide-react";
import Papa from "papaparse";

type Transaction = {
  id: number;
  department: string;
  unit: string;
  item: string;
  date: string;
  description: string;
  payOut: number;
  VAT: number;
  withoutVAT: number;
  deliveryFee: number;
  balance: number;
  status: string;
};


export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([
     {
      id: 1,
      department: "GA",
      unit: "0",
      item: "1",
      date: "1/25/2026",
      description: "headphone set(500 pcs)",
      payOut: 3000.9,
      VAT: 252.4,
      withoutVAT: 2102.5,
      deliveryFee: 394,
      balance: 97000.10,
      status: "Completed",
    },
    {
      id: 2,
      department: "GO",
      unit: "0",
      item: "2",
      date: "1/11/2026",
      description: "Humidity Temperature",
      payOut: 2000.5,
      VAT: 0,
      withoutVAT: 178,
      deliveryFee: 58.5,
      balance: 95000.6,
      status: "Completed",
    },
  ]);
 // ===================================================
  const [form, setForm] = useState({
    department: "",
  unit: "",
  item: "",
  date: "",
  description: "",
  payOut: "",
  VAT: "",
  withoutVAT: "",
  deliveryFee: "",
  balance: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [income, setIncome] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
 // ===================================================
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  const newTransaction: Transaction = {
    id: Date.now(),
    department: form.department,
    unit: form.unit,
    item: form.item,
    date: form.date,
    description: form.description,
    payOut: Number(form.payOut),
    VAT: Number(form.VAT),
    withoutVAT: Number(form.withoutVAT),
    deliveryFee: Number(form.deliveryFee),
    balance: Number(form.balance),
    status: "Pending",
  };
    setTransactions([newTransaction, ...transactions]);
    setForm({ department: "", unit: "", item: "", date: "", description: "", payOut: "", VAT: "", withoutVAT: "", deliveryFee: "", balance: "" });
  };

    // ===================================================
const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: (results) => {
      const data = results.data as any[];

      const formatted = data.map((row) => ({
        id: Date.now() + Math.random(),
        date: row.date,
        department: row.department,
        unit: row.unit,
        item: row.item,
        description: row.description,
        payOut: Number(row.payOut),
        VAT: Number(row.VAT),
        withoutVAT: Number(row.withoutVAT),
        deliveryFee: Number(row.deliveryFee),
        balance: Number(row.balance),
        status: "Pending",
      }));

      setTransactions((prev) => [...prev, ...formatted]);
    },
  });
};
  
  // ===================================================
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
         <section className="col-span-12 xl:col-span-4 bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
              <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold uppercase tracking-wide text-[#727780]">
              Set Total Income
            </label>
            <input
              type="number"
              value={income}
              onChange={(e) => setIncome(Number(e.target.value))}
              className="border rounded px-2 py-1"
              placeholder="Enter total income"
            />
            <button className="px-3 py-1 bg-[#00355f] text-white rounded text-sm mt-2" onClick={() => alert(`Total income set to $${income}`)}>
              Save Income
            </button>
          </div>

              <div className="p-2 bg-[#00355f]/10 rounded-lg">
                <PlusCircle className="text-[#00355f]" size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#00355f] tracking-tight">Add New Transaction</h3>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* DATE + DEPARTMENT */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</label>
                  <input required type="date" name="date" value={form.date} onChange={handleChange} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#00355f]/20 focus:border-[#00355f] outline-none transition-all" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Department</label>
                  <select required name="department" value={form.department} onChange={handleChange} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#00355f]/20 focus:border-[#00355f] outline-none transition-all">
                    <option value="">Select Dept</option>
                    <option value="IT Ops">IT Ops</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>
              </div>

              {/* UNIT + ITEM */}
              <div className="grid grid-cols-2 gap-4">
                <input name="unit" placeholder="Unit" value={form.unit} onChange={handleChange} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#00355f]/20 focus:border-[#00355f] outline-none transition-all" />
                <input name="item" placeholder="Item" value={form.item} onChange={handleChange} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#00355f]/20 focus:border-[#00355f] outline-none transition-all" />
              </div>

              {/* DESCRIPTION */}
              <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#00355f]/20 focus:border-[#00355f] outline-none transition-all h-24 resize-none" />

            {/* FINANCIALS */}
          <div className="grid grid-cols-2 gap-4">
            {['payOut', 'VAT', 'withoutVAT', 'deliveryFee'].map((field) => (
              <input 
                key={field} 
                type="number" 
                name={field} 
                placeholder={field.replace(/([A-Z])/g, ' $1').trim()} 
                // Add 'as keyof typeof form' here to satisfy TypeScript
                value={form[field as keyof typeof form]}
                onChange={handleChange} 
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#00355f]/20 focus:border-[#00355f] outline-none transition-all" 
              />
            ))}
            <input 
              type="number" 
              name="balance" 
              placeholder="Balance" 
              value={form.balance} 
              onChange={handleChange} 
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#00355f]/20 focus:border-[#00355f] outline-none transition-all col-span-2" 
            />
          </div>
              {/* SUBMIT */}
              <button type="submit" className="w-full py-3 bg-[#00355f] hover:bg-[#002542] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all active:scale-[0.98]">
                Save Transaction
              </button>
            </form>
            {/* BULK UPLOAD SECTION */}
            <div className="mt-8 pt-8 border-t border-slate-100">
              <label className="block text-sm font-semibold text-slate-700 mb-3">Bulk Import CSV / Excel</label>
              <div className="space-y-3">
                <input type="file" accept=".csv, .xlsx" onChange={handleFileUpload} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#00355f]/10 file:text-[#00355f] hover:file:bg-[#00355f]/20 cursor-pointer" />
                <button type="button" className="w-full py-2.5 border-2 border-[#00355f] text-[#00355f] hover:bg-[#00355f] hover:text-white font-semibold rounded-lg transition-all">
                  Save Bulk Upload
                </button>
              </div>
            </div>
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
                  <tbody className="divide-y divide-[#c2c7d1]/50">
                    {filteredTransactions.map((t) => (
                      <tr key={t.id} className="hover:bg-[#F0F7FF] transition-colors group">
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