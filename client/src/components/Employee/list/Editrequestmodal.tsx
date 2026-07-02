import { useState, useEffect } from "react";
import { X, Save, AlertCircle } from "lucide-react";
import type { Request } from "../../../types/requestList";
import type { RequestFormData } from "../../../types/requestForm";
import { editRequest } from "../../../apis/employeeRequest";

// ─── Payload shape matches your PUT /api/requests/{id}/ endpoint ──────────────


interface FormErrors {
  description?: string;
  due_date?:    string;
  amount?:      string;
  payee_name?:  string;
}

interface Props {
  req:      Request | null;
  onClose:  () => void;
  onSaved:  (updated: Request) => void;
}

// ─── Shared input class ───────────────────────────────────────────────────────
const inputCls =
  "w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-[13px] text-[#1a2e3f] outline-none placeholder:text-slate-400 focus:border-[#00355f] focus:ring-2 focus:ring-[#00355f]/10 transition-all";

const labelCls = "block text-[12px] font-bold text-[#1a2e3f] mb-1.5";

function ErrorMsg({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-red-600">
      <AlertCircle size={11} /> {msg}
    </p>
  );
}

// ─── Toggle checkbox (■ / □) ──────────────────────────────────────────────────
function Toggle<T extends string>({
  options, value, onChange,
}: {
  options: { label: string; value: T }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-4">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#1a2e3f]"
        >
          <span
            className={`inline-flex h-4 w-4 flex-shrink-0 border-[1.5px] transition-colors ${
              value === o.value
                ? "border-[#00355f] bg-[#00355f]"
                : "border-slate-400 bg-white"
            }`}
          />
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
export default function EditRequestModal({ req, onClose, onSaved }: Props) {
  const [form,    setForm]    = useState<RequestFormData | null>(null);
  const [errors,  setErrors]  = useState<FormErrors>({});
  const [saving,  setSaving]  = useState(false);
  const [apiError,setApiError]= useState<string | null>(null);

  // Pre-fill form whenever a request is passed in
  useEffect(() => {
    if (!req) { setForm(null); return; }
    setForm({
      project_no:     (req as any).project_no     ?? "",
      date:           req.date                    ?? "",
      due_date:       (req as any).due_date       ?? "",
      description:    req.description             ?? "",
      currency:       (req.currency as any)       ?? "PHP",
      amount:         req.amount                  ?? "",
      vat:            (req as any).vat            ?? "",
      without_vat:    (req as any).without_vat    ?? "",
      delivery_fee:   (req as any).delivery_fee   ?? "",
      payment_method: (req as any).payment_method ?? "CASH",
      payee_type:     (req as any).payee_type     ?? "EMPLOYEE",
      payee_name:     (req as any).payee_name     ?? "",
      note:           (req as any).note           ?? "",
    });
    setErrors({});
    setApiError(null);
  }, [req]);

  if (!req || !form) return null;

  // ── Helpers ────────────────────────────────────────────────────────────────
  const set = <K extends keyof RequestFormData>(key: K, value: RequestFormData[K]) =>
    setForm((prev) => prev ? { ...prev, [key]: value } : prev);

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!form.description.trim()) e.description = "Description is required.";
    if (!form.due_date)           e.due_date    = "Due date is required.";
    if (!form.amount || parseFloat(form.amount) <= 0)
      e.amount = "Enter a valid amount.";
    if (form.payee_type === "SUPPLIER" && !form.payee_name.trim())
      e.payee_name = "Supplier name is required.";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate();
    if (Object.keys(found).length) { setErrors(found); return; }
    setErrors({});
    setSaving(true);
    setApiError(null);
    try {
      const updated = await editRequest(String(req.id), form as RequestFormData);
      // Merge updated fields back into the local Request shape for the list
      onSaved({
        ...req,
        description: updated.description ?? form.description,
        date:        updated.date        ?? form.date,
        amount:      updated.amount      ?? form.amount,
        currency:    updated.currency    ?? form.currency,
        status:      updated.status      ?? req.status,
        // carry over any extra fields the API returns
        ...updated,
      });
    } catch (err: any) {
      setApiError(err?.message ?? "Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ── Derived ────────────────────────────────────────────────────────────────
  const sym   = form.currency === "PHP" ? "₱" : form.currency === "USD" ? "$" : "";
  const total = (parseFloat(form.without_vat) || 0) + (parseFloat(form.vat) || 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-[#00355f] px-6 py-4">
          <div>
            <p className="font-mono text-[11px] font-medium text-white/60">{req.request_no}</p>
            <h2 className="text-[17px] font-extrabold text-white">Edit Request</h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-white/60 transition-colors hover:bg-white/15 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Form ────────────────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="overflow-y-auto" style={{ maxHeight: "78vh" }}>
          <div className="space-y-5 px-6 py-5">

            {/* API-level error */}
            {apiError && (
              <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-600">
                <AlertCircle size={15} /> {apiError}
              </div>
            )}

            {/* Row: dates + project */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Date</label>
                <input type="date" value={form.date}
                  onChange={(e) => set("date", e.target.value)}
                  className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Due Date <span className="text-red-500">*</span></label>
                <input type="date" value={form.due_date}
                  onChange={(e) => { set("due_date", e.target.value); setErrors((p) => ({ ...p, due_date: "" })); }}
                  className={`${inputCls} ${errors.due_date ? "border-red-400" : ""}`} />
                <ErrorMsg msg={errors.due_date} />
              </div>
              <div>
                <label className={labelCls}>Project No.</label>
                <input value={form.project_no}
                  onChange={(e) => set("project_no", e.target.value)}
                  placeholder="PRJ-2026-01"
                  className={inputCls} />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className={labelCls}>Description <span className="text-red-500">*</span></label>
              <textarea rows={3} value={form.description}
                onChange={(e) => { set("description", e.target.value); setErrors((p) => ({ ...p, description: "" })); }}
                placeholder="Describe the purpose of this request…"
                className={`${inputCls} resize-none leading-relaxed ${errors.description ? "border-red-400" : ""}`} />
              <ErrorMsg msg={errors.description} />
            </div>

            {/* Currency */}
            <div>
              <label className={labelCls}>Currency</label>
              <Toggle<"PHP"|"USD"|"Other">
                options={[{label:"PHP",value:"PHP"},{label:"USD",value:"USD"},{label:"Other",value:"Other"}]}
                value={form.currency} onChange={(v) => set("currency", v)}
              />
            </div>

            {/* Financial row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Without VAT <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[13px] text-slate-400">{sym}</span>
                  <input type="number" min="0" step="0.01" value={form.without_vat}
                    onChange={(e) => { set("without_vat", e.target.value); setErrors((p) => ({ ...p, amount: "" })); }}
                    placeholder="0.00"
                    className={`${inputCls} pl-7 tabular-nums ${errors.amount ? "border-red-400" : ""}`} />
                </div>
                <ErrorMsg msg={errors.amount} />
              </div>
              <div>
                <label className={labelCls}>VAT</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[13px] text-slate-400">{sym}</span>
                  <input type="number" min="0" step="0.01" value={form.vat}
                    onChange={(e) => set("vat", e.target.value)}
                    placeholder="0.00"
                    className={`${inputCls} pl-7 tabular-nums`} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Delivery Fee</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[13px] text-slate-400">{sym}</span>
                  <input type="number" min="0" step="0.01" value={form.delivery_fee}
                    onChange={(e) => set("delivery_fee", e.target.value)}
                    placeholder="0.00"
                    className={`${inputCls} pl-7 tabular-nums`} />
                </div>
              </div>
              {/* Derived total */}
              <div>
                <label className={labelCls}>Total Amount</label>
                <div className="flex h-[42px] items-center rounded-xl border border-zinc-100 bg-[#00355f]/5 px-4">
                  <span className="font-bold tabular-nums text-[#00355f]">
                    {sym}{total.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment method */}
            <div>
              <label className={labelCls}>Payment Method</label>
              <Toggle<"CASH"|"T/T">
                options={[{label:"Cash",value:"CASH"},{label:"T/T",value:"T/T"}]}
                value={form.payment_method} onChange={(v) => set("payment_method", v)}
              />
            </div>

            {/* Payee */}
            <div>
              <label className={labelCls}>Payee</label>
              <Toggle<"EMPLOYEE"|"SUPPLIER">
                options={[{label:"Employee",value:"EMPLOYEE"},{label:"Supplier",value:"SUPPLIER"}]}
                value={form.payee_type} onChange={(v) => set("payee_type", v)}
              />
              {form.payee_type === "SUPPLIER" && (
                <div className="mt-2">
                  <input value={form.payee_name}
                    onChange={(e) => { set("payee_name", e.target.value); setErrors((p) => ({ ...p, payee_name: "" })); }}
                    placeholder="Supplier name"
                    className={`${inputCls} ${errors.payee_name ? "border-red-400" : ""}`} />
                  <ErrorMsg msg={errors.payee_name} />
                </div>
              )}
            </div>

            {/* Note */}
            <div>
              <label className={labelCls}>Note</label>
              <textarea rows={2} value={form.note}
                onChange={(e) => set("note", e.target.value)}
                placeholder="If there is any withholding payment or special instruction…"
                className={`${inputCls} resize-none leading-relaxed`} />
            </div>

          </div>

          {/* ── Footer ────────────────────────────────────────────────────── */}
          <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/60 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-[13px] font-bold text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-[#00355f] px-6 py-2.5 text-[13px] font-bold text-white transition-colors hover:bg-[#0f4c81] disabled:opacity-70"
            >
              {saving
                ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Saving…</>
                : <><Save size={14} /> Save Changes</>}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}