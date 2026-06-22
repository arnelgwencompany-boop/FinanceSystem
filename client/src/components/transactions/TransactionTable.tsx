import { Edit2, Trash2, ChevronLeft, ChevronRight, Search, Filter, ArrowUpDown } from "lucide-react";
import { useState } from "react";
import type { Transaction } from "../../types/transactions";
import { DEPARTMENTS } from "../../types/transactions";

type Props = {
  transactions: Transaction[];
  onDelete: (id: number) => void;
  onEdit: (t: Transaction) => void;
};

const PAGE_SIZE = 10;

function StatusBadge({ status }: { status: Transaction["status"] }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide
        ${status === "Completed"
          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
          : "bg-amber-50 text-amber-700 border border-amber-200"
        }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${status === "Completed" ? "bg-emerald-500" : "bg-amber-400"}`} />
      {status}
    </span>
  );
}

function fmt(n: number) {
  return n.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function TransactionTable({ transactions, onDelete, onEdit }: Props) {
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<keyof Transaction | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const toggleSort = (field: keyof Transaction) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("asc"); }
  };

  let filtered = transactions.filter((t) => {
    const q = search.toLowerCase();
    const matchSearch =
      t.description.toLowerCase().includes(q) ||
      t.department.toLowerCase().includes(q) ||
      t.item.toLowerCase().includes(q);
    const matchDept = deptFilter === "All" || t.department === deptFilter;
    const matchStatus = statusFilter === "All" || t.status === statusFilter;
    return matchSearch && matchDept && matchStatus;
  });

  if (sortField) {
    filtered = [...filtered].sort((a, b) => {
      const va = a[sortField], vb = b[sortField];
      const dir = sortDir === "asc" ? 1 : -1;
      if (typeof va === "number" && typeof vb === "number") return (va - vb) * dir;
      return String(va).localeCompare(String(vb)) * dir;
    });
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const SortTh = ({ field, children, right }: { field: keyof Transaction; children: React.ReactNode; right?: boolean }) => (
    <th
      className={`px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#727780] cursor-pointer select-none hover:text-[#00355f] transition-colors ${right ? "text-right" : ""}`}
      onClick={() => toggleSort(field)}
    >
      <span className="inline-flex items-center gap-1">
        {children}
        <ArrowUpDown size={10} className={sortField === field ? "text-[#00355f]" : "opacity-30"} />
      </span>
    </th>
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="bg-white border border-[#c2c7d1] rounded-xl shadow-sm p-3 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0a8b3]" size={15} />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search description, department…"
            className="w-full h-9 border border-[#c2c7d1] rounded-lg pl-9 pr-3 text-[13px] focus:border-[#00355f] focus:ring-1 focus:ring-[#00355f]/20 outline-none bg-slate-50"
          />
        </div>
        <div className="flex gap-2 items-center">
          <Filter size={14} className="text-[#a0a8b3]" />
          <select
            value={deptFilter}
            onChange={(e) => { setDeptFilter(e.target.value); setPage(1); }}
            className="h-9 border border-[#c2c7d1] rounded-lg px-3 text-[12px] font-semibold text-[#505f76] bg-[#f7f9fb] outline-none cursor-pointer"
          >
            <option value="All">All Departments</option>
            {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="h-9 border border-[#c2c7d1] rounded-lg px-3 text-[12px] font-semibold text-[#505f76] bg-[#f7f9fb] outline-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#c2c7d1] rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-[#f7f9fb] border-b border-[#c2c7d1]">
                <SortTh field="date">Date</SortTh>
                <SortTh field="department">Dept</SortTh>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#727780]">Unit</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#727780]">Item</th>
                <SortTh field="description">Description</SortTh>
                <SortTh field="payOut" right>Pay Out</SortTh>
                <SortTh field="VAT" right>VAT</SortTh>
                <SortTh field="withoutVAT" right>W/O VAT</SortTh>
                <SortTh field="deliveryFee" right>Delivery</SortTh>
                <SortTh field="balance" right>Balance</SortTh>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#727780] text-center">Status</th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[#727780] text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c2c7d1]/40">
              {paged.map((t) => (
                <tr key={t.id} className="hover:bg-[#f0f7ff] transition-colors group">
                  <td className="px-4 py-3 text-[#505f76] whitespace-nowrap text-xs">{t.date}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#00355f]/8 text-[#00355f] font-bold text-[10px] uppercase tracking-wide">
                      {t.department}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#505f76] text-xs">{t.unit}</td>
                  <td className="px-4 py-3 text-[#505f76] text-xs">{t.item}</td>
                  <td className="px-4 py-3 text-[#1a2e3f] max-w-[200px] truncate text-xs">{t.description}</td>
                  <td className="px-4 py-3 text-right font-bold text-[#ba1a1a] text-xs whitespace-nowrap">₱{fmt(t.payOut)}</td>
                  <td className="px-4 py-3 text-right text-[#505f76] text-xs">{t.VAT > 0 ? `₱${fmt(t.VAT)}` : "—"}</td>
                  <td className="px-4 py-3 text-right text-[#505f76] text-xs">₱{fmt(t.withoutVAT)}</td>
                  <td className="px-4 py-3 text-right text-[#505f76] text-xs">₱{fmt(t.deliveryFee)}</td>
                  <td className="px-4 py-3 text-right font-bold text-[#07497d] text-xs whitespace-nowrap">₱{fmt(t.balance)}</td>
                  <td className="px-4 py-3 text-center">
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(t)}
                        className="p-1.5 rounded-md text-[#727780] hover:text-[#00355f] hover:bg-[#00355f]/8 transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => onDelete(t.id)}
                        className="p-1.5 rounded-md text-[#727780] hover:text-[#ba1a1a] hover:bg-[#ba1a1a]/8 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr>
                  <td colSpan={12} className="px-4 py-12 text-center text-[13px] text-[#a0a8b3]">
                    No transactions match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 bg-[#f7f9fb] border-t border-[#c2c7d1] flex justify-between items-center">
          <span className="text-[12px] text-[#727780]">
            {filtered.length === 0
              ? "No entries"
              : `${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filtered.length)} of ${filtered.length}`}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="h-8 w-8 flex items-center justify-center border border-[#c2c7d1] rounded-lg bg-white text-[#505f76] hover:bg-[#f2f4f6] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`h-8 w-8 border rounded-lg text-[13px] font-semibold transition-colors ${
                  p === page
                    ? "border-[#00355f] bg-[#00355f] text-white"
                    : "border-[#c2c7d1] bg-white text-[#505f76] hover:bg-[#f2f4f6]"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="h-8 w-8 flex items-center justify-center border border-[#c2c7d1] rounded-lg bg-white text-[#505f76] hover:bg-[#f2f4f6] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}