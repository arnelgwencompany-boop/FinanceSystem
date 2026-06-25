import { useState, useRef } from "react";
import {
  FileText, User, Building2, Briefcase, Hash,
  Calendar, DollarSign, AlignLeft, Tag, AlertCircle,
  Paperclip, X, CheckCircle2, Clock, XCircle,
  Send, Save, ArrowLeft,
  Filter, Search, Eye,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type RequestType = "Petty Cash" | "Leave" | "Reimbursement" | "Other";
type Priority    = "Low" | "Medium" | "High";
type ReqStatus   = "Pending" | "Approved" | "Rejected" | "Draft";
type Currency    = "PHP" | "USD" | "Other";
type PayMethod   = "T/T" | "Cash";

interface UploadedFile { name: string; size: string; type: string; }

interface PreviousRequest {
  id: string; title: string; type: RequestType;
  amount: number; status: ReqStatus; date: string; description: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────
const LOGGED_IN_USER = {
  name:       "Juan dela Cruz",
  employeeId: "EMP-2026-0042",
  department: "IT Ops",
  role:       "Employee",
  ext:        "103",
};

const PREVIOUS_REQUESTS: PreviousRequest[] = [
  { id: "REQ-2026-001", title: "Headphone set",          type: "Petty Cash",    amount: 3000.90, status: "Approved",  date: "2026-01-25", description: "Bulk headphone purchase for team." },
  { id: "REQ-2026-002", title: "Network Switch",          type: "Petty Cash",    amount: 8500.00, status: "Pending",   date: "2026-02-03", description: "24-port switch for server room." },
  { id: "REQ-2026-003", title: "Annual Leave — March",    type: "Leave",         amount: 0,       status: "Approved",  date: "2026-02-15", description: "Annual leave March 10–14." },
  { id: "REQ-2026-004", title: "Taxi reimbursement",      type: "Reimbursement", amount: 450.00,  status: "Rejected",  date: "2026-03-01", description: "Client visit transport." },
  { id: "REQ-2026-005", title: "Office supplies draft",   type: "Petty Cash",    amount: 950.00,  status: "Draft",     date: "2026-03-10", description: "Stationery restock." },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const statusMeta: Record<ReqStatus, { icon: React.ReactNode; bg: string; text: string; dot: string }> = {
  Pending:  { icon: <Clock size={13} />,       bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-400"   },
  Approved: { icon: <CheckCircle2 size={13} />, bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500"  },
  Rejected: { icon: <XCircle size={13} />,      bg: "bg-red-50",     text: "text-red-600",     dot: "bg-red-500"     },
  Draft:    { icon: <Save size={13} />,          bg: "bg-slate-100",  text: "text-slate-600",   dot: "bg-slate-400"   },
};

const FINANCIAL_TYPES: RequestType[] = ["Petty Cash", "Reimbursement"];

const inputCls =
  "w-full border-2 border-slate-200 rounded-xl px-4 py-3.5 text-[16px] text-[#1a2e3f] bg-white outline-none transition-all focus:border-[#00355f] focus:ring-4 focus:ring-[#00355f]/10 placeholder:text-slate-400";

const readonlyCls =
  "w-full border-2 border-slate-100 rounded-xl px-4 py-3.5 text-[16px] text-[#505f76] bg-slate-50 cursor-default select-none";

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-[15px] font-bold text-[#1a2e3f] mb-2">
      {children}{required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
}

function ErrorMsg({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <div className="flex items-center gap-1.5 mt-1.5 text-[13px] text-red-600">
      <AlertCircle size={14} /> {msg}
    </div>
  );
}

// ─── Approval Flow ────────────────────────────────────────────────────────────
function ApprovalFlow({ activeStep }: { activeStep: number }) {
  const steps = ["Applicant", "Supervisor", "Director", "FA / Finance"];
  return (
    <div>
      <h3 className="text-[17px] font-bold text-[#00355f] mb-4">Approval Workflow</h3>
      <div className="flex items-center gap-0 overflow-x-auto pb-2">
        {steps.map((step, i) => {
          const done    = i < activeStep;
          const current = i === activeStep;
          return (
            <div key={step} className="flex items-center">
              <div className="flex flex-col items-center min-w-[90px]">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center text-[14px] font-extrabold border-2 transition-all ${
                  done    ? "bg-emerald-500 border-emerald-500 text-white" :
                  current ? "bg-[#00355f] border-[#00355f] text-white shadow-lg" :
                            "bg-white border-slate-200 text-slate-400"
                }`}>
                  {done ? <CheckCircle2 size={20} /> : i + 1}
                </div>
                <span className={`text-[12px] font-semibold mt-2 text-center leading-tight ${
                  done || current ? "text-[#00355f]" : "text-slate-400"
                }`}>{step}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`h-[2px] w-10 mx-1 flex-shrink-0 mb-5 ${done ? "bg-emerald-400" : "bg-slate-200"}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function EmployeeRequestPage() {
  // Form state
  const [requestType,   setRequestType]   = useState<RequestType>("Petty Cash");
  const [title,         setTitle]         = useState("");
  const [description,   setDescription]   = useState("");
  const [amount,        setAmount]        = useState("");
  const [currency,      setCurrency]      = useState<Currency>("PHP");
  const [withheld,      setWithheld]      = useState("");
  const [payMethod,     setPayMethod]     = useState<PayMethod>("T/T");
  const [priority,      setPriority]      = useState<Priority>("Medium");
  const [requiredDate,  setRequiredDate]  = useState("");
  const [projectNo,     setProjectNo]     = useState("");
  const [note,          setNote]          = useState("");
  const [files,         setFiles]         = useState<UploadedFile[]>([]);
  const [errors,        setErrors]        = useState<Record<string, string>>({});
  const [submitStatus,  setSubmitStatus]  = useState<"idle" | "loading" | "success">("idle");

  // Previous requests filter
  const [filterStatus, setFilterStatus]   = useState<ReqStatus | "All">("All");
  const [filterType,   setFilterType]     = useState<RequestType | "All">("All");
  const [searchQ,      setSearchQ]        = useState("");
  const [viewDetail,   setViewDetail]     = useState<PreviousRequest | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  const isFinancial = FINANCIAL_TYPES.includes(requestType);

  const net = () => {
    const a = parseFloat(amount) || 0;
    const w = parseFloat(withheld) || 0;
    return (a - w).toLocaleString("en-PH", { minimumFractionDigits: 2 });
  };

  // File upload
  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files || []);
    const mapped = picked.map((f) => ({
      name: f.name,
      size: f.size > 1024 * 1024 ? `${(f.size / 1024 / 1024).toFixed(1)} MB` : `${(f.size / 1024).toFixed(0)} KB`,
      type: f.type.startsWith("image/") ? "image" : "pdf",
    }));
    setFiles((p) => [...p, ...mapped]);
    if (fileRef.current) fileRef.current.value = "";
  };

  const removeFile = (i: number) => setFiles((p) => p.filter((_, idx) => idx !== i));

  // Validate
  const validate = () => {
    const e: Record<string, string> = {};
    if (!title.trim())       e.title       = "Request title is required.";
    if (!description.trim()) e.description = "Description is required.";
    if (!requiredDate)       e.requiredDate = "Required date is required.";
    if (isFinancial && (!amount || parseFloat(amount) <= 0))
      e.amount = "Please enter a valid amount.";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setErrors({});
    setSubmitStatus("loading");
    // Simulate API POST /api/requests/
    setTimeout(() => setSubmitStatus("success"), 1600);
  };

  const handleDraft = () => {
    alert("Draft saved successfully.");
  };

  const handleReset = () => {
    setTitle(""); setDescription(""); setAmount(""); setWithheld("");
    setRequiredDate(""); setProjectNo(""); setNote(""); setFiles([]);
    setErrors({}); setSubmitStatus("idle");
  };

  // Filter previous requests
  const filtered = PREVIOUS_REQUESTS.filter((r) => {
    const matchStatus = filterStatus === "All" || r.status === filterStatus;
    const matchType   = filterType   === "All" || r.type   === filterType;
    const matchSearch = r.title.toLowerCase().includes(searchQ.toLowerCase()) ||
                        r.id.toLowerCase().includes(searchQ.toLowerCase());
    return matchStatus && matchType && matchSearch;
  });

  // ── Success screen ─────────────────────────────────────────────────────────
  if (submitStatus === "success") {
    return (
      <main className="ml-[260px] mt-16 min-h-[calc(100vh-64px)] bg-[#f7f9fb] flex items-center justify-center p-8">
        <div className="bg-white rounded-3xl shadow-lg p-12 flex flex-col items-center text-center max-w-md w-full">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 size={44} className="text-emerald-600" />
          </div>
          <h2 className="text-[24px] font-extrabold text-[#00355f] mb-2">Request Submitted!</h2>
          <p className="text-[16px] text-slate-500 mb-2">Your request has been submitted for approval.</p>
          <p className="text-[14px] text-slate-400 mb-8">You will receive a notification once it is reviewed.</p>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-3 bg-[#00355f] text-white text-[16px] font-bold rounded-xl hover:bg-[#0f4c81] transition-colors"
          >
            <ArrowLeft size={18} /> Submit Another Request
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="ml-[260px] mt-16 min-h-[calc(100vh-64px)] bg-[#f7f9fb] overflow-y-auto">
      <div className="px-8 py-8 max-w-5xl mx-auto space-y-6">

        {/* ── Page Header ──────────────────────────────────────────────────── */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#00355f] flex items-center justify-center flex-shrink-0">
            <FileText size={22} color="white" />
          </div>
          <div>
            <h1 className="text-[24px] font-extrabold text-[#00355f] leading-tight">Employee Request Form</h1>
            <p className="text-[15px] text-slate-500 mt-0.5">Submit your request for approval</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* ── Employee Info ─────────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
              <User size={18} className="text-[#00355f]" />
              <h2 className="text-[17px] font-bold text-[#00355f]">Employee Information</h2>
            </div>
            <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-5">
              {[
                { label: "Full Name",    value: LOGGED_IN_USER.name,       icon: <User size={16} />       },
                { label: "Employee ID",  value: LOGGED_IN_USER.employeeId,  icon: <Hash size={16} />       },
                { label: "Extension",   value: LOGGED_IN_USER.ext,          icon: <Hash size={16} />       },
                { label: "Department",  value: LOGGED_IN_USER.department,   icon: <Building2 size={16} />  },
                { label: "Role",        value: LOGGED_IN_USER.role,         icon: <Briefcase size={16} /> },
              ].map(({ label, value, icon }) => (
                <div key={label}>
                  <FieldLabel>{label}</FieldLabel>
                  <div className={`${readonlyCls} flex items-center gap-2`}>
                    <span className="text-slate-400">{icon}</span>
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Request Details ───────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
              <Tag size={18} className="text-[#00355f]" />
              <h2 className="text-[17px] font-bold text-[#00355f]">Request Details</h2>
            </div>
            <div className="p-6 space-y-5">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Request Type */}
                <div>
                  <FieldLabel required>Request Type</FieldLabel>
                  <select className={inputCls} value={requestType}
                    onChange={(e) => { setRequestType(e.target.value as RequestType); setAmount(""); }}>
                    {(["Petty Cash","Leave","Reimbursement","Other"] as RequestType[]).map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>

                {/* Project No */}
                <div>
                  <FieldLabel>Project No.</FieldLabel>
                  <input className={inputCls} value={projectNo}
                    onChange={(e) => setProjectNo(e.target.value)} placeholder="e.g. PROJ-2026-01 (optional)" />
                </div>
              </div>

              {/* Title */}
              <div>
                <FieldLabel required>Request Title</FieldLabel>
                <input className={`${inputCls} ${errors.title ? "border-red-400" : ""}`}
                  value={title} onChange={(e) => { setTitle(e.target.value); setErrors((p) => ({ ...p, title: "" })); }}
                  placeholder="e.g. Office supplies purchase" />
                <ErrorMsg msg={errors.title} />
              </div>

              {/* Description */}
              <div>
                <FieldLabel required>Description</FieldLabel>
                <textarea rows={4}
                  className={`${inputCls} resize-none leading-relaxed ${errors.description ? "border-red-400" : ""}`}
                  value={description}
                  onChange={(e) => { setDescription(e.target.value); setErrors((p) => ({ ...p, description: "" })); }}
                  placeholder="Describe the purpose of your request in detail…" />
                <ErrorMsg msg={errors.description} />
              </div>

              {/* Financial fields */}
              {isFinancial && (
                <div className="p-5 rounded-xl border-2 border-slate-100 bg-slate-50 space-y-5">
                  <h3 className="text-[16px] font-bold text-[#00355f]">Financial Details</h3>

                  {/* Currency */}
                  <div>
                    <FieldLabel>Currency</FieldLabel>
                    <div className="flex gap-4">
                      {(["PHP","USD","Other"] as Currency[]).map((c) => (
                        <label key={c} className="flex items-center gap-2 cursor-pointer"
                          onClick={() => setCurrency(c)}>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            currency === c ? "border-[#00355f] bg-[#00355f]" : "border-slate-300"
                          }`}>
                            {currency === c && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                          <span className="text-[15px] font-medium text-[#1a2e3f]">{c}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Amount */}
                    <div>
                      <FieldLabel required>Total Amount</FieldLabel>
                      <div className="relative">
                        <DollarSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="number" min="0" step="0.01"
                          className={`${inputCls} pl-10 ${errors.amount ? "border-red-400" : ""}`}
                          value={amount}
                          onChange={(e) => { setAmount(e.target.value); setErrors((p) => ({ ...p, amount: "" })); }}
                          placeholder="0.00" />
                      </div>
                      <ErrorMsg msg={errors.amount} />
                    </div>

                    {/* Withheld */}
                    <div>
                      <FieldLabel>Withheld Amount</FieldLabel>
                      <div className="relative">
                        <DollarSign size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="number" min="0" step="0.01"
                          className={`${inputCls} pl-10`} value={withheld}
                          onChange={(e) => setWithheld(e.target.value)} placeholder="0.00" />
                      </div>
                      <p className="text-[13px] text-slate-400 mt-1">Specify if there is any withholding payment.</p>
                    </div>
                  </div>

                  {/* Net */}
                  {amount && (
                    <div className="flex items-center justify-between px-5 py-3 bg-[#00355f] rounded-xl">
                      <span className="text-[15px] font-bold text-white">Net Amount</span>
                      <span className="text-[18px] font-extrabold text-white">
                        {currency === "PHP" ? "₱" : currency === "USD" ? "$" : ""}{net()}
                      </span>
                    </div>
                  )}

                  {/* Payment Method */}
                  <div>
                    <FieldLabel>Payment Method</FieldLabel>
                    <div className="flex gap-4">
                      {(["T/T","Cash"] as PayMethod[]).map((m) => (
                        <label key={m} className="flex items-center gap-2 cursor-pointer" onClick={() => setPayMethod(m)}>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            payMethod === m ? "border-[#00355f] bg-[#00355f]" : "border-slate-300"
                          }`}>
                            {payMethod === m && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                          <span className="text-[15px] font-medium text-[#1a2e3f]">{m}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Priority */}
                <div>
                  <FieldLabel required>Priority</FieldLabel>
                  <select className={inputCls} value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
                    {(["Low","Medium","High"] as Priority[]).map((p) => <option key={p}>{p}</option>)}
                  </select>
                </div>

                {/* Required Date */}
                <div>
                  <FieldLabel required>Required Date</FieldLabel>
                  <div className="relative">
                    <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input type="date" className={`${inputCls} pl-10 ${errors.requiredDate ? "border-red-400" : ""}`}
                      value={requiredDate}
                      onChange={(e) => { setRequiredDate(e.target.value); setErrors((p) => ({ ...p, requiredDate: "" })); }} />
                  </div>
                  <ErrorMsg msg={errors.requiredDate} />
                </div>
              </div>

              {/* Note */}
              <div>
                <FieldLabel>Additional Note</FieldLabel>
                <div className="relative">
                  <AlignLeft size={16} className="absolute left-4 top-4 text-slate-400" />
                  <textarea rows={2} className={`${inputCls} pl-10 resize-none`}
                    value={note} onChange={(e) => setNote(e.target.value)}
                    placeholder="Any additional notes or instructions…" />
                </div>
              </div>
            </div>
          </div>

          {/* ── Attachment ────────────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
              <Paperclip size={18} className="text-[#00355f]" />
              <h2 className="text-[17px] font-bold text-[#00355f]">Attachments</h2>
              <span className="ml-auto text-[13px] text-slate-400">PDF, JPG, PNG accepted</span>
            </div>
            <div className="p-6 space-y-4">
              {/* Drop zone */}
              <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-slate-200 rounded-xl py-10 flex flex-col items-center gap-3 cursor-pointer hover:border-[#00355f]/40 hover:bg-slate-50 transition-all"
              >
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                  <Paperclip size={22} className="text-slate-400" />
                </div>
                <div className="text-center">
                  <p className="text-[16px] font-bold text-[#1a2e3f]">Click to upload files</p>
                  <p className="text-[14px] text-slate-400 mt-1">Invoice, receipt, or supporting documents</p>
                </div>
              </div>
              <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png"
                multiple onChange={handleFiles} className="hidden" />

              {/* File list */}
              {files.length > 0 && (
                <div className="space-y-2">
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-[11px] font-bold ${
                        f.type === "image" ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"
                      }`}>
                        {f.type === "image" ? "IMG" : "PDF"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-semibold text-[#1a2e3f] truncate">{f.name}</p>
                        <p className="text-[12px] text-slate-400">{f.size}</p>
                      </div>
                      <button type="button" onClick={() => removeFile(i)}
                        className="text-slate-300 hover:text-red-500 transition-colors">
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Approval Workflow ──────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <ApprovalFlow activeStep={0} />
          </div>

          {/* ── Action Buttons ─────────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-6 py-5 flex flex-col sm:flex-row items-center gap-3">
            <button type="submit" disabled={submitStatus === "loading"}
              className="flex items-center justify-center gap-2.5 px-8 py-4 bg-[#00355f] text-white text-[16px] font-bold rounded-xl hover:bg-[#0f4c81] transition-all shadow-sm w-full sm:w-auto">
              {submitStatus === "loading"
                ? <><span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full" /> Submitting…</>
                : <><Send size={18} /> Submit Request</>}
            </button>
            <button type="button" onClick={handleDraft}
              className="flex items-center justify-center gap-2.5 px-8 py-4 bg-white text-[#00355f] border-2 border-[#00355f] text-[16px] font-bold rounded-xl hover:bg-slate-50 transition-all w-full sm:w-auto">
              <Save size={18} /> Save as Draft
            </button>
            <button type="button" onClick={handleReset}
              className="flex items-center justify-center gap-2.5 px-8 py-4 text-slate-500 border-2 border-slate-200 text-[16px] font-bold rounded-xl hover:bg-slate-50 transition-all w-full sm:w-auto">
              <X size={18} /> Cancel
            </button>
          </div>
        </form>

        {/* ── Previous Requests ─────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
            <Clock size={18} className="text-[#00355f]" />
            <h2 className="text-[17px] font-bold text-[#00355f]">My Previous Requests</h2>
          </div>

          {/* Filters */}
          <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[180px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-[14px] outline-none focus:border-[#00355f] transition-all"
                placeholder="Search requests…" value={searchQ} onChange={(e) => setSearchQ(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={15} className="text-slate-400" />
              <select className="border border-slate-200 rounded-xl px-3 py-2.5 text-[14px] text-[#1a2e3f] outline-none focus:border-[#00355f]"
                value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as any)}>
                <option value="All">All Status</option>
                {(["Pending","Approved","Rejected","Draft"] as ReqStatus[]).map((s) => <option key={s}>{s}</option>)}
              </select>
              <select className="border border-slate-200 rounded-xl px-3 py-2.5 text-[14px] text-[#1a2e3f] outline-none focus:border-[#00355f]"
                value={filterType} onChange={(e) => setFilterType(e.target.value as any)}>
                <option value="All">All Types</option>
                {(["Petty Cash","Leave","Reimbursement","Other"] as RequestType[]).map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {filtered.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-[15px] text-slate-400 font-semibold">No requests match your filters.</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    {["Request ID","Title","Type","Amount","Status","Date",""].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-[12px] font-bold uppercase tracking-widest text-slate-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map((r) => {
                    const sm = statusMeta[r.status];
                    return (
                      <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-4 text-[14px] font-bold text-[#00355f] font-mono">{r.id}</td>
                        <td className="px-5 py-4 text-[14px] font-semibold text-[#1a2e3f]">{r.title}</td>
                        <td className="px-5 py-4">
                          <span className="text-[12px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-lg">{r.type}</span>
                        </td>
                        <td className="px-5 py-4 text-[14px] font-bold text-[#ba1a1a]">
                          {r.amount > 0 ? `₱${r.amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}` : "—"}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 text-[12px] font-bold px-2.5 py-1 rounded-full ${sm.bg} ${sm.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${sm.dot}`} />
                            {r.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-[13px] text-slate-500">{r.date}</td>
                        <td className="px-5 py-4">
                          <button onClick={() => setViewDetail(r)}
                            className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 rounded-lg text-[12px] font-semibold text-[#00355f] hover:bg-slate-50 transition-colors">
                            <Eye size={13} /> View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* ── Detail modal ─────────────────────────────────────────────────────── */}
      {viewDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-[#00355f] rounded-t-2xl">
              <div>
                <p className="text-[13px] font-bold text-white/60 font-mono">{viewDetail.id}</p>
                <h3 className="text-[17px] font-extrabold text-white">{viewDetail.title}</h3>
              </div>
              <button onClick={() => setViewDetail(null)} className="text-white/60 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {[
                { label: "Type",        value: viewDetail.type },
                { label: "Description", value: viewDetail.description },
                { label: "Amount",      value: viewDetail.amount > 0 ? `₱${viewDetail.amount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}` : "N/A" },
                { label: "Date",        value: viewDetail.date },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-[12px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
                  <p className="text-[15px] font-semibold text-[#1a2e3f] mt-1">{value}</p>
                </div>
              ))}
              <div>
                <p className="text-[12px] font-bold uppercase tracking-widest text-slate-400">Status</p>
                <span className={`inline-flex items-center gap-1.5 text-[13px] font-bold px-3 py-1 rounded-full mt-1 ${statusMeta[viewDetail.status].bg} ${statusMeta[viewDetail.status].text}`}>
                  <span className={`w-2 h-2 rounded-full ${statusMeta[viewDetail.status].dot}`} />
                  {viewDetail.status}
                </span>
              </div>
              <ApprovalFlow activeStep={viewDetail.status === "Approved" ? 4 : viewDetail.status === "Rejected" ? 1 : 0} />
            </div>
            <div className="px-6 pb-5 flex justify-end">
              <button onClick={() => setViewDetail(null)}
                className="px-6 py-2.5 bg-[#00355f] text-white text-[14px] font-bold rounded-xl hover:bg-[#0f4c81] transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}