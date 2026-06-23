import { PlusCircle } from "lucide-react";
import Papa from "papaparse";
import type { TransactionFormValues } from "../../types/transactions";
import type { Transaction } from "../../types/transactions";
import { DEPARTMENTS } from "../../types/transactions";
type Props = {
  form: TransactionFormValues;
  income: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onIncomeChange: (val: number) => void;
  onBulkImport: (rows: Omit<Transaction, "id">[]) => void;
};

const FINANCIAL_FIELDS: { name: keyof TransactionFormValues; label: string }[] = [
  { name: "payOut", label: "Pay Out" },
  { name: "VAT", label: "VAT" },
  { name: "withoutVAT", label: "Without VAT" },
  { name: "deliveryFee", label: "Delivery Fee" },
];

export default function TransactionForm({
  form, income, onChange, onSubmit, onIncomeChange, onBulkImport,
}: Props) {
  const inputClass =
    "w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#00355f]/20 focus:border-[#00355f] outline-none transition-all text-sm";

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = (results.data as any[]).map((row) => ({
          date: row.date ?? "",
          department: row.department ?? "",
          unit: row.unit ?? "",
          item: row.item ?? "",
          description: row.description ?? "",
          payOut: Number(row.payOut) || 0,
          VAT: Number(row.VAT) || 0,
          withoutVAT: Number(row.withoutVAT) || 0,
          deliveryFee: Number(row.deliveryFee) || 0,
          balance: Number(row.balance) || 0,
          status: "Pending" as const,
        }));
        onBulkImport(rows);
      },
    });
    e.target.value = "";
  };

  return (
    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-7 flex flex-col gap-7">
      {/* Income setter */}
      <div className="bg-[#f7f9fb] border border-slate-200 rounded-xl p-4 flex flex-col gap-2">
        <label className="text-[10px] font-bold uppercase tracking-widest text-[#727780]">
          Set Total Income
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            value={income}
            onChange={(e) => onIncomeChange(Number(e.target.value))}
            className={`${inputClass} flex-1`}
            placeholder="Enter total income"
          />
          <button
            type="button"
            onClick={() => alert(`Total income set to ₱${income.toLocaleString()}`)}
            className="px-4 py-2 bg-[#00355f] text-white rounded-lg text-sm font-semibold hover:bg-[#002542] transition-colors shrink-0"
          >
            Save
          </button>
        </div>
      </div>

      {/* Form heading */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-[#00355f]/10 rounded-lg">
          <PlusCircle className="text-[#00355f]" size={20} />
        </div>
        <div>
          <h3 className="text-base font-bold text-[#00355f]">Add Transaction</h3>
          <p className="text-[11px] text-[#727780]">Fill in details and save, this use for existing transactions.</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        {/* Date + Department */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#727780]">Date</label>
            <input required type="date" name="date" value={form.date} onChange={onChange} className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#727780]">Department</label>
            <select required name="department" value={form.department} onChange={onChange} className={inputClass}>
              <option value="">Select</option>
              {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        {/* Unit + Item */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#727780]">Unit</label>
            <input name="unit" value={form.unit} onChange={onChange} placeholder="e.g. 500 pcs" className={inputClass} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#727780]">Item #</label>
            <input name="item" value={form.item} onChange={onChange} placeholder="e.g. 001" className={inputClass} />
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-[#727780]">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            placeholder="Brief description of the transaction..."
            className={`${inputClass} h-20 resize-none`}
          />
        </div>

        {/* Financial fields */}
        <div className="grid grid-cols-2 gap-3">
          {FINANCIAL_FIELDS.map(({ name, label }) => (
            <div key={name} className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#727780]">{label}</label>
              <input
                type="number"
                name={name}
                value={form[name]}
                onChange={onChange}
                placeholder="0.00"
                className={inputClass}
              />
            </div>
          ))}
        </div>

        {/* Balance (full width) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-[#727780]">Balance</label>
          <input
            type="number"
            name="balance"
            value={form.balance}
            onChange={onChange}
            placeholder="0.00"
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-[#00355f] hover:bg-[#002542] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all active:scale-[0.98] text-sm mt-1"
        >
          Save Transaction
        </button>
      </form>

      {/* Bulk import */}
      <div className="border-t border-slate-100 pt-5 flex flex-col gap-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#727780]">Bulk Import</p>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="w-full text-sm text-slate-500 file:mr-3 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#00355f]/10 file:text-[#00355f] hover:file:bg-[#00355f]/20 cursor-pointer"
        />
        <p className="text-[10px] text-[#a0a8b3]">Accepted columns: date, department, unit, item, description, payOut, VAT, withoutVAT, deliveryFee, balance.</p>
      </div>
    </section>
  );
}