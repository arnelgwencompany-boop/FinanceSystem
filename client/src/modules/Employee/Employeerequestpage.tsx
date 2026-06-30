import React, { useState} from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  Send,
  Printer,
  Save,
  Paperclip,
  X,
  CheckCircle2,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";

// ─── Types & Interfaces ──────────────────────────────────────────────────
interface UserProfile {
  name: string;
  employeeId: string;
  department: string;
  ext: string;
}

interface Option {
  label: string;
  value: string;
}

interface FileItem {
  name: string;
  size: string;
}

interface FormErrors {
  description?: string;
  dueDate?: string;
  withoutVat?: string;
  payeeName?: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────
const LOGGED_IN_USER: UserProfile = {
  name: "Juan dela Cruz",
  employeeId: "EMP-2026-0042",
  department: "IT Ops",
  ext: "103",
};
const COMPANY_NAME = "Company Name";

const CURRENCY_OPTIONS: Option[] = [
  { label: "USD", value: "USD" },
  { label: "PHP", value: "PHP" },
  { label: "Other", value: "Other" },
];
const PAYMENT_OPTIONS: Option[] = [
  { label: "T/T", value: "T/T" },
  { label: "Cash", value: "CASH" },
];
const PAYEE_OPTIONS: Option[] = [
  { label: "Employee", value: "EMPLOYEE" },
  { label: "Supplier", value: "SUPPLIER" },
];

const todayISO = (): string => new Date().toISOString().slice(0, 10);
const computeAmount = (a: number, b: number): number =>
  Math.round((a + b) * 100) / 100;
const currencySymbol = (c: string): string =>
  c === "PHP" ? "₱" : c === "USD" ? "$" : "";
const formatCurrency = (v: number, c: string): string =>
  `${currencySymbol(c)}${v.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
  })}`;

// ─── Shared Primitives ────────────────────────────────────────────────────
interface CellProps {
  label: string;
  required?: boolean;
  error?: string;
  highlight?: boolean;
  children: React.ReactNode;
}

function Cell({ label, required, error, highlight, children }: CellProps) {
  return (
    <div className={`px-4 py-3 ${highlight ? "doc-highlight" : ""}`}>
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </p>
      <div className="mt-1 min-h-[20px] text-sm font-medium doc-ink">
        {children}
      </div>
      {error && (
        <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-red-600">
          <AlertCircle size={11} /> {error}
        </p>
      )}
    </div>
  );
}

interface ToggleFieldProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
}

function ToggleField({ options, value, onChange }: ToggleFieldProps) {
  return (
    <span className="inline-flex flex-wrap items-center gap-4">
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            type="button"
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className="inline-flex items-center gap-1.5 text-sm font-medium doc-ink"
          >
            <span
              className={`inline-flex h-4 w-4 flex-shrink-0 border-2 ${
                active ? "doc-toggle-on" : "border-slate-400 bg-white"
              }`}
            />
            {opt.label}
          </button>
        );
      })}
    </span>
  );
}

const inputCls =
  "w-full bg-transparent outline-none text-sm doc-ink placeholder-slate-400";

// ─── Document Sections ────────────────────────────────────────────────────
function DocumentHeader({
  date,
  onDateChange,
}: {
  date: string;
  onDateChange: (val: string) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 pb-5 pt-8 sm:flex-row sm:items-end sm:justify-between">
      <div className="hidden sm:block sm:flex-1" />
      <h1 className="doc-serif text-center text-2xl font-bold tracking-tight doc-ink">
        {COMPANY_NAME}
      </h1>
      <div className="flex flex-1 items-center justify-center gap-2 text-sm text-slate-500 sm:justify-end">
        <span className="font-semibold doc-ink">Date:</span>
        <input
          type="date"
          value={date}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onDateChange(e.target.value)
          }
          className="border-b border-zinc-300 bg-transparent px-1 outline-none focus:doc-border-brand doc-ink"
        />
      </div>
    </div>
  );
}

function InfoRow({
  projectNo,
  onProjectNoChange,
  dueDate,
  onDueDateChange,
  dueDateError,
}: {
  projectNo: string;
  onProjectNoChange: (val: string) => void;
  dueDate: string;
  onDueDateChange: (val: string) => void;
  dueDateError?: string;
}) {
  return (
    <div className="grid grid-cols-2 divide-x divide-y divide-zinc-300 border-y border-zinc-300 sm:grid-cols-3 lg:grid-cols-6 lg:divide-y-0">
      <Cell label="Employee ID">{LOGGED_IN_USER.employeeId}</Cell>
      <Cell label="Name">{LOGGED_IN_USER.name}</Cell>
      <Cell label="Ext.">{LOGGED_IN_USER.ext}</Cell>
      <Cell label="Dept.">{LOGGED_IN_USER.department}</Cell>
      <Cell label="Project No.">
        <input
          value={projectNo}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onProjectNoChange(e.target.value)
          }
          placeholder="PRJ-2026-01"
          className={inputCls}
        />
      </Cell>
      <Cell label="Due Date" required error={dueDateError}>
        <input
          type="date"
          value={dueDate}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onDueDateChange(e.target.value)
          }
          className={inputCls}
        />
      </Cell>
    </div>
  );
}

function DescriptionBox({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (val: string) => void;
  error?: string;
}) {
  return (
    <div className="border-b border-zinc-300 px-6 py-4">
      <label className="text-sm font-bold doc-ink">
        Description<span className="ml-1 text-red-500">*</span>
      </label>
      <textarea
        rows={3}
        value={value}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
          onChange(e.target.value)
        }
        placeholder="Describe the purpose of this request…"
        className="mt-1.5 w-full resize-none bg-transparent text-sm leading-relaxed outline-none placeholder-slate-400 doc-ink"
      />
      {error && (
        <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-red-600">
          <AlertCircle size={11} /> {error}
        </p>
      )}
    </div>
  );
}

function FinancialSection({
  currency,
  onCurrencyChange,
  withoutVat,
  onWithoutVatChange,
  vat,
  onVatChange,
  deliveryFee,
  onDeliveryFeeChange,
  withoutVatError,
}: {
  currency: string;
  onCurrencyChange: (val: string) => void;
  withoutVat: string;
  onWithoutVatChange: (val: string) => void;
  vat: string;
  onVatChange: (val: string) => void;
  deliveryFee: string;
  onDeliveryFeeChange: (val: string) => void;
  withoutVatError?: string;
}) {
  const amount = computeAmount(
    parseFloat(withoutVat) || 0,
    parseFloat(vat) || 0
  );
  const sym = currencySymbol(currency);

  const row = (
    label: string,
    value: string,
    onChange: (val: string) => void,
    opts: { required?: boolean; error?: string } = {}
  ) => (
    <Cell label={label} required={opts.required} error={opts.error}>
      <div className="flex items-center gap-1">
        <span className="text-slate-400">{sym}</span>
        <input
          type="number"
          min="0"
          step="0.01"
          inputMode="decimal"
          value={value}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            onChange(e.target.value)
          }
          placeholder="0.00"
          className={`${inputCls} doc-tabular`}
        />
      </div>
    </Cell>
  );

  return (
    <div className="border-b border-zinc-300">
      <div className="flex flex-wrap items-center gap-3 border-b border-zinc-300 bg-slate-50 px-6 py-3">
        <span className="text-sm font-bold doc-ink">Currency</span>
        <ToggleField
          options={CURRENCY_OPTIONS}
          value={currency}
          onChange={onCurrencyChange}
        />
      </div>
      <div className="grid grid-cols-2 divide-x divide-y divide-zinc-300 lg:grid-cols-4 lg:divide-y-0">
        {row("Without VAT", withoutVat, onWithoutVatChange, {
          required: true,
          error: withoutVatError,
        })}
        {row("VAT", vat, onVatChange)}
        {row("Delivery Fee", deliveryFee, onDeliveryFeeChange)}
        <Cell label="Total Amount" highlight>
          <span className="font-bold doc-brand doc-tabular">
            {formatCurrency(amount, currency)}
          </span>
        </Cell>
      </div>
    </div>
  );
}

function PayeeSection({
  paymentMethod,
  onPaymentMethodChange,
  payeeType,
  onPayeeTypeChange,
  payeeName,
  onPayeeNameChange,
  payeeNameError,
}: {
  paymentMethod: string;
  onPaymentMethodChange: (val: string) => void;
  payeeType: string;
  onPayeeTypeChange: (val: string) => void;
  payeeName: string;
  onPayeeNameChange: (val: string) => void;
  payeeNameError?: string;
}) {
  return (
    <div className="divide-y divide-zinc-300 border-b border-zinc-300">
      <div className="flex flex-wrap items-center gap-3 px-6 py-3">
        <span className="text-sm font-bold doc-ink">Payment Method</span>
        <ToggleField
          options={PAYMENT_OPTIONS}
          value={paymentMethod}
          onChange={onPaymentMethodChange}
        />
      </div>
      <div className="px-6 py-3">
        <div className="flex flex-wrap items-center gap-3">
          <ToggleField
            options={PAYEE_OPTIONS}
            value={payeeType}
            onChange={onPayeeTypeChange}
          />
          {payeeType === "SUPPLIER" && (
            <div className="flex min-w-[200px] flex-1 items-center gap-2">
              <span className="text-sm text-slate-400">:</span>
              <input
                value={payeeName}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  onPayeeNameChange(e.target.value)
                }
                placeholder="Supplier name"
                className={`flex-1 border-b bg-transparent px-1 text-sm outline-none placeholder-slate-400 doc-ink ${
                  payeeNameError ? "border-red-400" : "border-zinc-300"
                }`}
              />
            </div>
          )}
        </div>
        {payeeNameError && (
          <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-red-600">
            <AlertCircle size={11} /> {payeeNameError}
          </p>
        )}
      </div>
    </div>
  );
}

function SignatureBlock() {
  const names = ["Applicant", "Supervisor", "Director", "Approval"];
  return (
    <div className="border-b border-zinc-300">
      <p className="border-b border-zinc-300 px-6 py-2.5 text-xs text-slate-500">
        Process: Applicant <span className="mx-1">→</span> Supervisor{" "}
        <span className="mx-1">→</span> Director <span className="mx-1">→</span>{" "}
        FA
      </p>
      <div className="grid grid-cols-4 divide-x divide-zinc-300">
        {names.map((n) => (
          <div key={n} className="px-3 py-2.5 text-center text-xs font-bold doc-ink">
            {n}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-4 divide-x divide-zinc-300 border-t border-zinc-300">
        {names.map((n) => (
          <div key={n} className="h-14" />
        ))}
      </div>
    </div>
  );
}

function AttachmentBox({
  files,
  onAttach,
  onRemove,
}: {
  files: FileItem[];
  onAttach: (files: FileItem[]) => void;
  onRemove: (index: number) => void;
}) {
  const handlePick = (e: ChangeEvent<HTMLInputElement>) => {
    const picked: FileItem[] = Array.from(e.target.files || []).map((f) => ({
      name: f.name,
      size:
        f.size > 1024 * 1024
          ? `${(f.size / 1024 / 1024).toFixed(1)} MB`
          : `${(f.size / 1024).toFixed(0)} KB`,
    }));
    onAttach(picked);
    e.target.value = "";
  };

  return (
    <div className="border-b border-zinc-300 px-6 py-4">
      <p className="flex items-center gap-2 text-sm font-bold doc-ink">
        <span className="h-1.5 w-1.5 rounded-full bg-slate-700" /> Invoice /
        Receipt
      </p>
      <div className="mt-2.5 space-y-2">
        {files.map((f, i) => (
          <div
            key={`${f.name}-${i}`}
            className="flex items-center gap-2 text-sm doc-ink"
          >
            <Paperclip size={13} className="flex-shrink-0 text-slate-400" />
            <span className="truncate">{f.name}</span>
            <span className="text-slate-400">· {f.size}</span>
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="ml-auto text-slate-300 hover:text-red-500"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold doc-brand">
          <Paperclip size={13} />{" "}
          {files.length === 0 ? "Attach invoice or receipt" : "Attach another file"}
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            multiple
            onChange={handlePick}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
}

function NoteBox({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="px-6 py-4">
      <p className="flex items-center gap-2 text-sm font-bold doc-ink">
        <span className="h-1.5 w-1.5 rounded-full bg-slate-700" /> Note
      </p>
      <textarea
        rows={2}
        value={value}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
          onChange(e.target.value)
        }
        placeholder="If there is any withholding payment or special instruction, specify here…"
        className="mt-2 w-full resize-none bg-transparent text-sm leading-relaxed outline-none placeholder-slate-400 doc-ink"
      />
    </div>
  );
}

function Toolbar({
  loading,
  onPrint,
  onSaveDraft,
}: {
  loading: boolean;
  onPrint: () => void;
  onSaveDraft: () => void;
}) {
  return (
    <div className="doc-toolbar mt-5 flex flex-col items-center gap-3 sm:flex-row">
      <button
        type="submit"
        disabled={loading}
        className="doc-btn-primary flex w-full items-center justify-center gap-2.5 rounded-xl px-8 py-3.5 text-sm font-bold text-white shadow-sm sm:w-auto"
      >
        {loading ? (
          <>
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />{" "}
            Submitting…
          </>
        ) : (
          <>
            <Send size={17} /> Submit Request
          </>
        )}
      </button>
      <button
        type="button"
        onClick={onPrint}
        className="doc-btn-outline flex w-full items-center justify-center gap-2.5 rounded-xl border-2 bg-white px-6 py-3.5 text-sm font-bold sm:w-auto"
      >
        <Printer size={17} /> Print
      </button>
      <button
        type="button"
        onClick={onSaveDraft}
        className="flex w-full items-center justify-center gap-2.5 rounded-xl border-2 border-slate-200 px-6 py-3.5 text-sm font-bold text-slate-500 hover:bg-slate-50 sm:w-auto"
      >
        <Save size={17} /> Save Draft
      </button>
    </div>
  );
}

function SuccessScreen({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex h-full min-h-[520px] items-center justify-center py-8">
      <div className="flex w-full max-w-md flex-col items-center rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 size={44} className="text-emerald-600" />
        </div>
        <h2 className="mb-2 text-2xl font-extrabold doc-brand">
          Request Submitted!
        </h2>
        <p className="mb-2 text-base text-slate-500">
          Your request has been submitted for approval.
        </p>
        <p className="mb-8 text-sm text-slate-400">
          You will receive a notification once it is reviewed.
        </p>
        <button
          onClick={onReset}
          className="doc-btn-primary flex items-center gap-2 rounded-xl px-6 py-3 text-base font-bold text-white"
        >
          <ArrowLeft size={18} /> Submit Another Request
        </button>
      </div>
    </div>
  );
}

// ─── Main Page Export ─────────────────────────────────────────────────────
export default function PaymentRequestPage() {
  const [projectNo, setProjectNo] = useState<string>("PRJ-2026-001");
  const [date, setDate] = useState<string>(todayISO());
  const [dueDate, setDueDate] = useState<string>("2026-06-30");
  const [description, setDescription] = useState<string>(
    "Purchase of new laptop for development team"
  );
  const [currency, setCurrency] = useState<string>("PHP");
  const [withoutVat, setWithoutVat] = useState<string>("66000.00");
  const [vat, setVat] = useState<string>("9000.00");
  const [deliveryFee, setDeliveryFee] = useState<string>("500.00");
  const [paymentMethod, setPaymentMethod] = useState<string>("CASH");
  const [payeeType, setPayeeType] = useState<string>("SUPPLIER");
  const [payeeName, setPayeeName] = useState<string>("Tech Supplier Inc.");
  const [note, setNote] = useState<string>("Urgent requirement for new hire");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!description.trim()) e.description = "Description is required.";
    if (!dueDate) e.dueDate = "Due date is required.";
    if (!withoutVat || parseFloat(withoutVat) <= 0)
      e.withoutVat = "Enter a valid amount.";
    if (payeeType === "SUPPLIER" && !payeeName.trim())
      e.payeeName = "Supplier name is required.";
    return e;
  };

  const handleReset = () => {
    setProjectNo("");
    setDate(todayISO());
    setDueDate("");
    setDescription("");
    setCurrency("PHP");
    setWithoutVat("");
    setVat("");
    setDeliveryFee("");
    setPaymentMethod("CASH");
    setPayeeType("EMPLOYEE");
    setPayeeName("");
    setNote("");
    setFiles([]);
    setErrors({});
    setStatus("idle");
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const found = validate();
    if (Object.keys(found).length) {
      setErrors(found);
      return;
    }
    setErrors({});
    setStatus("loading");
    setTimeout(() => setStatus("success"), 900);
  };

  if (status === "success") return <SuccessScreen onReset={handleReset} />;

  return (
    <div className="w-full">
      {/* You can move these styles to a global CSS file if you prefer, 
        but keeping them here ensures the document styling remains intact.
      */}
      <style>{`
        .doc-ink { color: #1a2e3f; }
        .doc-brand { color: #00355f; }
        .doc-border-brand { border-color: #00355f; }
        .doc-toggle-on { background-color: #00355f; border-color: #00355f; }
        .doc-highlight { background-color: rgba(0,53,95,0.05); }
        .doc-serif { font-family: Georgia, 'Times New Roman', serif; }
        .doc-tabular { font-variant-numeric: tabular-nums; }
        .doc-btn-primary { background-color: #00355f; }
        .doc-btn-primary:hover { background-color: #0f4c81; }
        .doc-btn-outline { color: #00355f; border-color: #00355f; }
        .doc-btn-outline:hover { background-color: #f8fafc; }
        
        /* Print rules: Hides elements outside the document for clean printing */
        @media print {
          .doc-toolbar { display: none !important; }
          body, main, .w-full { background: white !important; margin: 0; padding: 0; }
        }
      `}</style>
      
      <form onSubmit={handleSubmit} className="mx-auto w-full max-w-4xl py-6">
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <DocumentHeader date={date} onDateChange={setDate} />
          <InfoRow
            projectNo={projectNo}
            onProjectNoChange={setProjectNo}
            dueDate={dueDate}
            onDueDateChange={setDueDate}
            dueDateError={errors.dueDate}
          />
          <DescriptionBox
            value={description}
            onChange={setDescription}
            error={errors.description}
          />
          <FinancialSection
            currency={currency}
            onCurrencyChange={setCurrency}
            withoutVat={withoutVat}
            onWithoutVatChange={setWithoutVat}
            vat={vat}
            onVatChange={setVat}
            deliveryFee={deliveryFee}
            onDeliveryFeeChange={setDeliveryFee}
            withoutVatError={errors.withoutVat}
          />
          <PayeeSection
            paymentMethod={paymentMethod}
            onPaymentMethodChange={setPaymentMethod}
            payeeType={payeeType}
            onPayeeTypeChange={setPayeeType}
            payeeName={payeeName}
            onPayeeNameChange={setPayeeName}
            payeeNameError={errors.payeeName}
          />
          <SignatureBlock />
          <AttachmentBox
            files={files}
            onAttach={(p) => setFiles((prev) => [...prev, ...p])}
            onRemove={(i) =>
              setFiles((prev) => prev.filter((_, idx) => idx !== i))
            }
          />
          <NoteBox value={note} onChange={setNote} />
        </div>
        <Toolbar
          loading={status === "loading"}
          onPrint={() => window.print()}
          onSaveDraft={() => alert("Draft saved successfully.")}
        />
      </form>
    </div>
  );
}