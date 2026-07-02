import {
  User, Building2, Hash, Calendar, AlignLeft,
  DollarSign, Truck, AlertCircle,
} from "lucide-react";
import type { RequestFormData, Currency, PaymentMethod, PayeeType } from "../../../types/requestForm";

// ─── Shared primitives ────────────────────────────────────────────────────────
export const inp =
  "w-full border-2 border-slate-200 rounded-xl px-4 py-3.5 text-[15px] text-[#1a2e3f] bg-white outline-none transition-all focus:border-[#00355f] focus:ring-4 focus:ring-[#00355f]/10 placeholder:text-slate-400";

const readOnly =
  "w-full border-2 border-slate-100 rounded-xl px-4 py-3.5 text-[15px] text-[#505f76] bg-slate-50 select-none";

export function Label({ children, req }: { children: React.ReactNode; req?: boolean }) {
  return (
    <label className="block text-[14px] font-bold text-[#1a2e3f] mb-2">
      {children}{req && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
}

export function Err({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <div className="flex items-center gap-1.5 mt-1.5 text-[13px] text-red-600">
      <AlertCircle size={13} />{msg}
    </div>
  );
}

export function SectionCard({ icon, title, children }: {
  icon: React.ReactNode; title: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
        <span className="text-[#00355f]">{icon}</span>
        <h2 className="text-[16px] font-bold text-[#00355f]">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function RadioGroup<T extends string>({
  options, value, onChange, labels,
}: { options: T[]; value: T; onChange: (v: T) => void; labels?: Record<string, string> }) {
  return (
    <div className="flex flex-wrap gap-5">
      {options.map((o) => (
        <label key={o} className="flex items-center gap-2.5 cursor-pointer" onClick={() => onChange(o)}>
          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
            value === o ? "border-[#00355f] bg-[#00355f]" : "border-slate-300"
          }`}>
            {value === o && <div className="w-2 h-2 rounded-full bg-white" />}
          </div>
          <span className="text-[15px] font-medium text-[#1a2e3f]">{labels?.[o] ?? o}</span>
        </label>
      ))}
    </div>
  );
}

// ─── Section props ─────────────────────────────────────────────────────────────
type P = {
  data: RequestFormData;
  errors: Record<string, string>;
  set: <K extends keyof RequestFormData>(k: K, v: RequestFormData[K]) => void;
};

// ─── 1. Requestor ──────────────────────────────────────────────────────────────
export function RequestorSection({ data, errors, set }: P) {
  // Auto-fill from localStorage if available
  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user") || "{}"); } catch { return {}; }
  })();

  return (
    <SectionCard icon={<User size={18}/>} title="Requestor Information">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label req>Employee ID</Label>
          <div className={`${readOnly} flex items-center gap-2`}>
            <Hash size={15} className="text-slate-400 flex-shrink-0"/>
            <span>{data.employee_id || user.employeeId || "—"}</span>
          </div>
        </div>
        <div>
          <Label req>Department</Label>
          <div className={`${readOnly} flex items-center gap-2`}>
            <Building2 size={15} className="text-slate-400 flex-shrink-0"/>
            <span>{data.department || user.department || "—"}</span>
          </div>
        </div>
        <div>
          <Label>Extension</Label>
          <input className={inp} value={data.ext}
            onChange={(e) => set("ext", e.target.value)} placeholder="e.g. 1234"/>
        </div>
        <div>
          <Label>Project No.</Label>
          <input className={inp} value={data.project_no}
            onChange={(e) => set("project_no", e.target.value)} placeholder="PRJ-2026-001"/>
        </div>
        <div>
          <Label req>Date</Label>
          <div className="relative">
            <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
            <input type="date" className={`${inp} pl-10 ${errors.date ? "border-red-400":""}`}
              value={data.date} onChange={(e) => set("date", e.target.value)}/>
          </div>
          <Err msg={errors.date}/>
        </div>
        <div>
          <Label req>Due Date</Label>
          <div className="relative">
            <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
            <input type="date" className={`${inp} pl-10 ${errors.due_date ? "border-red-400":""}`}
              value={data.due_date} onChange={(e) => set("due_date", e.target.value)}/>
          </div>
          <Err msg={errors.due_date}/>
        </div>
      </div>
    </SectionCard>
  );
}

// ─── 2. Description ────────────────────────────────────────────────────────────
export function DescriptionSection({ data, errors, set }: P) {
  return (
    <SectionCard icon={<AlignLeft size={18}/>} title="Description">
      <Label req>What is this request for?</Label>
      <textarea rows={4}
        className={`${inp} resize-none leading-relaxed ${errors.description ? "border-red-400":""}`}
        value={data.description}
        onChange={(e) => set("description", e.target.value)}
        placeholder="e.g. Purchase of new laptop for development team"/>
      <Err msg={errors.description}/>
    </SectionCard>
  );
}

// ─── 3. Financial ──────────────────────────────────────────────────────────────
export function FinancialSection({ data, errors, set }: P) {
  const total = (parseFloat(data.amount)||0) + (parseFloat(data.delivery_fee)||0);
  const s = data.currency === "PHP" ? "₱" : data.currency === "USD" ? "$" : "";

  return (
    <SectionCard icon={<DollarSign size={18}/>} title="Financial Details">
      <div className="space-y-5">
        {/* Currency */}
        <div>
          <Label>Currency</Label>
          <RadioGroup<Currency>
            options={["PHP","USD","Other"]}
            value={data.currency}
            onChange={(v) => set("currency", v)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Amount */}
          <div>
            <Label req>Amount</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-[15px]">{s||"$"}</span>
              <input type="number" min="0" step="0.01"
                className={`${inp} pl-9 ${errors.amount?"border-red-400":""}`}
                value={data.amount} onChange={(e) => set("amount", e.target.value)} placeholder="0.00"/>
            </div>
            <Err msg={errors.amount}/>
          </div>

          {/* VAT */}
          <div>
            <Label>VAT</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-[15px]">{s||"$"}</span>
              <input type="number" min="0" step="0.01" className={`${inp} pl-9`}
                value={data.vat} onChange={(e) => set("vat", e.target.value)} placeholder="0.00"/>
            </div>
          </div>

          {/* Without VAT */}
          <div>
            <Label>Amount Without VAT</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-[15px]">{s||"$"}</span>
              <input type="number" min="0" step="0.01" className={`${inp} pl-9`}
                value={data.without_vat} onChange={(e) => set("without_vat", e.target.value)} placeholder="0.00"/>
            </div>
          </div>

          {/* Delivery fee */}
          <div>
            <Label>Delivery Fee</Label>
            <div className="relative">
              <Truck size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"/>
              <input type="number" min="0" step="0.01" className={`${inp} pl-10`}
                value={data.delivery_fee} onChange={(e) => set("delivery_fee", e.target.value)} placeholder="0.00"/>
            </div>
          </div>
        </div>

        {/* Total */}
        {data.amount && (
          <div className="flex items-center justify-between px-5 py-3 bg-[#00355f] rounded-xl">
            <span className="text-[15px] font-bold text-white">Total Amount</span>
            <span className="text-[18px] font-extrabold text-white">
              {s}{total.toLocaleString("en-PH",{minimumFractionDigits:2})}
            </span>
          </div>
        )}

        {/* Payment method */}
        <div>
          <Label>Payment Method</Label>
          <RadioGroup<PaymentMethod>
            options={["CASH","T/T"]}
            value={data.payment_method}
            onChange={(v) => set("payment_method", v)}
            labels={{ CASH:"Cash", "T/T":"Bank Transfer (T/T)" }}
          />
        </div>
      </div>
    </SectionCard>
  );
}

// ─── 4. Payee + Note ──────────────────────────────────────────────────────────
export function PayeeSection({ data, errors, set }: P) {
  return (
    <SectionCard icon={<Building2 size={18}/>} title="Payee & Notes">
      <div className="space-y-5">
        <div>
          <Label>Payee Type</Label>
          <RadioGroup<PayeeType>
            options={["EMPLOYEE","SUPPLIER"]}
            value={data.payee_type}
            onChange={(v) => set("payee_type", v)}
            labels={{ EMPLOYEE:"Employee", SUPPLIER:"Supplier" }}
          />
        </div>
        {data.payee_type === "SUPPLIER" && (
          <div>
            <Label req>Supplier Name</Label>
            <input className={`${inp} ${errors.payee_name?"border-red-400":""}`}
              value={data.payee_name} onChange={(e) => set("payee_name", e.target.value)}
              placeholder="e.g. Tech Supplier Inc."/>
            <Err msg={errors.payee_name}/>
          </div>
        )}
        <div>
          <Label>Additional Note</Label>
          <textarea rows={2} className={`${inp} resize-none`}
            value={data.note} onChange={(e) => set("note", e.target.value)}
            placeholder="e.g. Urgent requirement for new hire"/>
        </div>
      </div>
    </SectionCard>
  );
}