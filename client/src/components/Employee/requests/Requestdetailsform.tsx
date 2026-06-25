import { EMPTY_FORM } from "../../types/requests";
import type { PaymentRequestForm } from "../../types/requests";

type Props = {
  form: PaymentRequestForm;
  onChange: (f: PaymentRequestForm) => void;
};

const inputClass =
  "w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] focus:ring-2 focus:ring-[#00355f]/20 focus:border-[#00355f] outline-none transition-all";

const labelClass = "text-[10px] font-bold uppercase tracking-widest text-[#727780] block mb-1";

export default function RequestDetailsForm({ form, onChange }: Props) {
  const set = (key: keyof PaymentRequestForm, val: string | number) =>
    onChange({ ...form, [key]: val });

  return (
    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-5">
      <div>
        <h3 className="text-[14px] font-bold text-[#00355f]">Request Details</h3>
        <p className="text-[11px] text-[#727780] mt-0.5">
          Fill in applicant info — these appear on the printed form.
        </p>
      </div>

      {/* Row 1 */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Employee ID</label>
          <input value={form.employeeId} onChange={(e) => set("employeeId", e.target.value)} placeholder="EMP-001" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Employee Name</label>
          <input value={form.employeeName} onChange={(e) => set("employeeName", e.target.value)} placeholder="Juan Dela Cruz" className={inputClass} />
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className={labelClass}>Ext.</label>
          <input value={form.ext} onChange={(e) => set("ext", e.target.value)} placeholder="1234" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Department</label>
          <input value={form.department} onChange={(e) => set("department", e.target.value)} placeholder="IT Ops" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Project No.</label>
          <input value={form.projectNo} onChange={(e) => set("projectNo", e.target.value)} placeholder="PRJ-2026-01" className={inputClass} />
        </div>
      </div>

      {/* Due Date */}
      <div>
        <label className={labelClass}>Due Date</label>
        <input type="date" value={form.dueDate} onChange={(e) => set("dueDate", e.target.value)} className={inputClass} />
      </div>

      {/* Currency */}
      <div>
        <label className={labelClass}>Currency</label>
        <div className="flex gap-4">
          {(["PHP", "USD", "Other"] as const).map((c) => (
            <label key={c} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="currency"
                checked={form.currency === c}
                onChange={() => set("currency", c)}
                className="accent-[#00355f]"
              />
              <span className="text-[12px] font-semibold text-[#505f76]">{c}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Payment Method */}
      <div>
        <label className={labelClass}>Payment Method</label>
        <div className="flex gap-4">
          {(["T/T", "Cash"] as const).map((m) => (
            <label key={m} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                checked={form.paymentMethod === m}
                onChange={() => set("paymentMethod", m)}
                className="accent-[#00355f]"
              />
              <span className="text-[12px] font-semibold text-[#505f76]">{m}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Payee */}
      <div>
        <label className={labelClass}>Payable To</label>
        <div className="flex gap-4 mb-2">
          {(["Employee", "Supplier"] as const).map((p) => (
            <label key={p} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="payeeTo"
                checked={form.payeeTo === p}
                onChange={() => set("payeeTo", p)}
                className="accent-[#00355f]"
              />
              <span className="text-[12px] font-semibold text-[#505f76]">{p}</span>
            </label>
          ))}
        </div>
        {form.payeeTo === "Supplier" && (
          <input
            value={form.supplierName}
            onChange={(e) => set("supplierName", e.target.value)}
            placeholder="Supplier name…"
            className={inputClass}
          />
        )}
      </div>

      {/* Withheld */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Withheld Amount</label>
          <input type="number" value={form.withheldAmount || ""} onChange={(e) => set("withheldAmount", Number(e.target.value))} placeholder="0.00" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Withheld Note</label>
          <input value={form.withheldNote} onChange={(e) => set("withheldNote", e.target.value)} placeholder="Reason…" className={inputClass} />
        </div>
      </div>

      {/* Invoice note */}
      <div>
        <label className={labelClass}>Invoice / Receipt Note</label>
        <textarea
          value={form.invoiceNote}
          onChange={(e) => set("invoiceNote", e.target.value)}
          placeholder="Official receipt #, invoice reference…"
          className={`${inputClass} h-16 resize-none`}
        />
      </div>

      {/* Reset */}
      <button
        type="button"
        onClick={() => onChange(EMPTY_FORM)}
        className="w-full py-2 border border-[#c2c7d1] rounded-lg text-[11px] font-bold uppercase tracking-wide text-[#727780] hover:bg-slate-50 transition-colors"
      >
        Reset Form
      </button>
    </section>
  );
}