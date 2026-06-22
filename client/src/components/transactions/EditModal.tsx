import { X } from "lucide-react";
import { useState, useEffect } from "react";
import type { Transaction } from "../../types/transactions";
import { DEPARTMENTS } from "../../types/transactions";

type Props = {
  transaction: Transaction | null;
  onClose: () => void;
  onSave: (updated: Transaction) => void;
};

export default function EditModal({ transaction, onClose, onSave }: Props) {
  const [form, setForm] = useState<Transaction | null>(null);

  useEffect(() => {
    setForm(transaction ? { ...transaction } : null);
  }, [transaction]);

  if (!form) return null;

  const inputClass =
    "w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#00355f]/20 focus:border-[#00355f] outline-none transition-all text-sm";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) =>
      prev
        ? {
            ...prev,
            [name]: ["payOut", "VAT", "withoutVAT", "deliveryFee", "balance"].includes(name)
              ? Number(value)
              : value,
          }
        : prev
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-[#00355f]">Edit Transaction</h3>
            <p className="text-[11px] text-[#727780]">ID #{form.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#727780] hover:text-[#00355f] hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#727780]">Date</label>
              <input type="date" name="date" value={form.date} onChange={handleChange} className={inputClass} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#727780]">Department</label>
              <select name="department" value={form.department} onChange={handleChange} className={inputClass}>
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#727780]">Unit</label>
              <input name="unit" value={form.unit} onChange={handleChange} className={inputClass} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#727780]">Item</label>
              <input name="item" value={form.item} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#727780]">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} className={`${inputClass} h-20 resize-none`} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {(["payOut", "VAT", "withoutVAT", "deliveryFee"] as const).map((f) => (
              <div key={f} className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#727780]">
                  {f.replace(/([A-Z])/g, " $1").trim()}
                </label>
                <input type="number" name={f} value={form[f]} onChange={handleChange} className={inputClass} />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#727780]">Balance</label>
              <input type="number" name="balance" value={form.balance} onChange={handleChange} className={inputClass} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[#727780]">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-[#c2c7d1] rounded-lg text-[#505f76] font-semibold text-sm hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => { onSave(form); onClose(); }}
            className="flex-1 py-2.5 bg-[#00355f] hover:bg-[#002542] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all text-sm active:scale-[0.98]"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}