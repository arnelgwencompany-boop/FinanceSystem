import { useState, useRef, useEffect } from "react";
import {
  Receipt, Upload, X, CheckCircle2, Clock, Wallet,
  FileText, Eye, AlertTriangle, Search,
  Loader2, Image, File, Trash2, CloudUpload, ArrowRight,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type ReceiptStatus  = "Not Uploaded" | "Uploaded" | "Verified" | "Mismatch";
type RequestStatus  = "Pending Finance" | "Approved" | "Cash Released" | "Awaiting Receipt"
                    | "Receipt Under Review" | "Mismatch Detected" | "Returned" | "Completed";

interface MyRequest {
  id: number;
  requestNo: string;
  description: string;
  department: string;
  approvedAmount: number;
  releasedDate: string;
  date: string;
  status: RequestStatus;
  receiptStatus: ReceiptStatus;
  receiptFile?: string;
  receiptUploadDate?: string;
  actualAmount?: number;
  financeNote?: string;
  category: string;
}

interface UploadFile {
  name: string;
  size: string;
  rawSize: number;
  type: "image" | "pdf";
  preview?: string;
}

interface Toast { id: number; type: "success" | "error" | "warning"; message: string; }

// ─── Mock data — only this employee's requests that have been cash-released ───
const MY_REQUESTS: MyRequest[] = [
  {
    id: 1, requestNo: "REQ-2026-002", description: "Printer cartridges (bulk)",
    department: "Marketing", approvedAmount: 1500.00, releasedDate: "2026-06-18",
    date: "2026-06-16", status: "Awaiting Receipt", receiptStatus: "Not Uploaded",
    category: "Office Supplies",
  },
  {
    id: 2, requestNo: "REQ-2026-008", description: "Software license renewal Q3",
    department: "Finance", approvedAmount: 2800.00, releasedDate: "2026-06-22",
    date: "2026-06-22", status: "Awaiting Receipt", receiptStatus: "Not Uploaded",
    category: "IT Equipment",
  },
  {
    id: 3, requestNo: "REQ-2026-001", description: "Headphone set (500 pcs)",
    department: "IT Ops", approvedAmount: 3000.90, releasedDate: "2026-06-17",
    date: "2026-06-15", status: "Mismatch Detected", receiptStatus: "Mismatch",
    receiptFile: "receipt_headphones.jpg", receiptUploadDate: "2026-06-20",
    actualAmount: 2985.00,
    financeNote: "Amount on receipt (₱2,985.00) does not match released amount (₱3,000.90). Please resubmit correct receipt or explain the difference.",
    category: "IT Equipment",
  },
  {
    id: 4, requestNo: "REQ-2026-003", description: "Network Switch (24-port)",
    department: "IT Ops", approvedAmount: 8500.00, releasedDate: "2026-06-19",
    date: "2026-06-17", status: "Completed", receiptStatus: "Verified",
    receiptFile: "receipt_network_switch.pdf", receiptUploadDate: "2026-06-19",
    actualAmount: 8500.00, category: "IT Equipment",
  },
  {
    id: 5, requestNo: "REQ-2026-010", description: "Event backdrop printing",
    department: "Marketing", approvedAmount: 3750.00, releasedDate: "2026-06-24",
    date: "2026-06-24", status: "Receipt Under Review", receiptStatus: "Uploaded",
    receiptFile: "receipt_backdrop.pdf", receiptUploadDate: "2026-06-25",
    actualAmount: 3750.00, category: "Marketing",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n: number) => `₱${n.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;

const STATUS_META: Record<RequestStatus, { bg: string; text: string; dot: string }> = {
  "Pending Finance":      { bg:"bg-amber-50",   text:"text-amber-700",   dot:"bg-amber-400"   },
  "Approved":             { bg:"bg-blue-50",    text:"text-blue-700",    dot:"bg-blue-400"    },
  "Cash Released":        { bg:"bg-indigo-50",  text:"text-indigo-700",  dot:"bg-indigo-400"  },
  "Awaiting Receipt":     { bg:"bg-orange-50",  text:"text-orange-700",  dot:"bg-orange-400"  },
  "Receipt Under Review": { bg:"bg-purple-50",  text:"text-purple-700",  dot:"bg-purple-400"  },
  "Mismatch Detected":    { bg:"bg-red-50",     text:"text-red-600",     dot:"bg-red-500"     },
  "Returned":             { bg:"bg-rose-50",    text:"text-rose-700",    dot:"bg-rose-500"    },
  "Completed":            { bg:"bg-emerald-50", text:"text-emerald-700", dot:"bg-emerald-500" },
};

const RECEIPT_META: Record<ReceiptStatus, { bg: string; text: string; label: string }> = {
  "Not Uploaded": { bg:"bg-slate-100",   text:"text-slate-500",   label:"Not Uploaded" },
  "Uploaded":     { bg:"bg-blue-100",    text:"text-blue-700",    label:"📄 Uploaded"  },
  "Verified":     { bg:"bg-emerald-100", text:"text-emerald-700", label:"✅ Verified"  },
  "Mismatch":     { bg:"bg-red-100",     text:"text-red-600",     label:"⚠️ Mismatch"  },
};

// ─── Upload Modal ─────────────────────────────────────────────────────────────
function UploadModal({
  req, onClose, onSubmit,
}: {
  req: MyRequest;
  onClose: () => void;
  onSubmit: (id: number, files: UploadFile[], actualAmount: string, notes: string) => void;
}) {
  const fileRef   = useRef<HTMLInputElement>(null);
  const [files,         setFiles]         = useState<UploadFile[]>([]);
  const [actualAmount,  setActualAmount]  = useState("");
  const [notes,         setNotes]         = useState("");
  const [dragging,      setDragging]      = useState(false);
  const [errors,        setErrors]        = useState<Record<string, string>>({});
  const isMismatch = req.status === "Mismatch Detected";

  const processFiles = (picked: File[]) => {
    const mapped: UploadFile[] = picked.map((f) => ({
      name: f.name,
      rawSize: f.size,
      size: f.size > 1024 * 1024 ? `${(f.size / 1024 / 1024).toFixed(1)} MB` : `${(f.size / 1024).toFixed(0)} KB`,
      type: f.type.startsWith("image/") ? "image" : "pdf",
      preview: f.type.startsWith("image/") ? URL.createObjectURL(f) : undefined,
    }));
    setFiles((p) => [...p, ...mapped]);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    processFiles(Array.from(e.dataTransfer.files));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (files.length === 0) e.files = "Please upload at least one receipt file.";
    if (!actualAmount || parseFloat(actualAmount) <= 0) e.amount = "Please enter the actual amount from your receipt.";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSubmit(req.id, files, actualAmount, notes);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">

        {/* Header */}
        <div className="px-7 py-6 flex-shrink-0"
          style={{ background: "linear-gradient(135deg,#00355f,#0f4c81)" }}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[12px] font-bold text-white/60 font-mono tracking-wide">{req.requestNo}</p>
              <h2 className="text-[19px] font-extrabold text-white mt-1 leading-tight">{req.description}</h2>
            </div>
            <button onClick={onClose} className="text-white/60 hover:text-white mt-1 flex-shrink-0">
              <X size={22}/>
            </button>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg">
              <Wallet size={14} className="text-white/70"/>
              <span className="text-[13px] font-bold text-white">Released: {fmt(req.approvedAmount)}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg">
              <Clock size={14} className="text-white/70"/>
              <span className="text-[13px] text-white/80">{req.releasedDate}</span>
            </div>
          </div>
        </div>

        {/* Mismatch notice */}
        {isMismatch && req.financeNote && (
          <div className="mx-6 mt-5 flex gap-3 p-4 rounded-xl border border-red-200 bg-red-50">
            <AlertTriangle size={18} className="text-red-600 flex-shrink-0 mt-0.5"/>
            <div>
              <p className="text-[13px] font-bold text-red-700 mb-1">Finance Note</p>
              <p className="text-[13px] text-red-700 leading-relaxed">{req.financeNote}</p>
            </div>
          </div>
        )}

        <div className="px-7 py-5 space-y-5 max-h-[55vh] overflow-y-auto">

          {/* Drop zone */}
          <div>
            <label className="text-[15px] font-bold text-[#1a2e3f] block mb-2">
              Upload Receipt <span className="text-red-500">*</span>
            </label>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl py-10 flex flex-col items-center gap-3 cursor-pointer transition-all ${
                dragging ? "border-[#00355f] bg-[#00355f]/5" : errors.files ? "border-red-400 bg-red-50" : "border-slate-200 hover:border-[#00355f]/40 hover:bg-slate-50"
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${dragging ? "bg-[#00355f]/10" : "bg-slate-100"}`}>
                <CloudUpload size={28} className={dragging ? "text-[#00355f]" : "text-slate-400"} />
              </div>
              <div className="text-center">
                <p className="text-[16px] font-bold text-[#1a2e3f]">
                  {dragging ? "Drop your files here" : "Click or drag to upload"}
                </p>
                <p className="text-[13px] text-slate-400 mt-1">Supports PDF, JPG, PNG · Max 10 MB per file</p>
              </div>
            </div>
            <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" multiple
              onChange={(e) => processFiles(Array.from(e.target.files || []))} className="hidden"/>
            {errors.files && (
              <div className="flex items-center gap-1.5 mt-2 text-[13px] text-red-600">
                <AlertTriangle size={14}/> {errors.files}
              </div>
            )}
          </div>

          {/* File list */}
          {files.length > 0 && (
            <div className="space-y-2">
              {files.map((f, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    f.type === "image" ? "bg-blue-100" : "bg-red-100"
                  }`}>
                    {f.type === "image"
                      ? f.preview
                        ? <img src={f.preview} alt="" className="w-10 h-10 rounded-xl object-cover"/>
                        : <Image size={18} className="text-blue-600"/>
                      : <File size={18} className="text-red-600"/>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-[#1a2e3f] truncate">{f.name}</p>
                    <p className="text-[12px] text-slate-400">{f.size} · {f.type.toUpperCase()}</p>
                  </div>
                  <button onClick={() => setFiles((p) => p.filter((_, idx) => idx !== i))}
                    className="text-slate-300 hover:text-red-500 transition-colors flex-shrink-0">
                    <Trash2 size={16}/>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Actual amount */}
          <div>
            <label className="text-[15px] font-bold text-[#1a2e3f] block mb-2">
              Actual Amount from Receipt <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[16px] font-bold text-slate-400">₱</span>
              <input
                type="number" min="0" step="0.01"
                value={actualAmount}
                onChange={(e) => { setActualAmount(e.target.value); setErrors((p) => ({ ...p, amount: "" })); }}
                placeholder="0.00"
                className={`w-full pl-9 pr-4 py-3.5 border-2 rounded-xl text-[16px] text-[#1a2e3f] outline-none transition-all focus:ring-4 focus:ring-[#00355f]/10 ${
                  errors.amount ? "border-red-400 focus:border-red-400" : "border-slate-200 focus:border-[#00355f]"
                }`}
              />
            </div>
            {errors.amount && (
              <div className="flex items-center gap-1.5 mt-2 text-[13px] text-red-600">
                <AlertTriangle size={14}/> {errors.amount}
              </div>
            )}
            {/* Mismatch preview */}
            {actualAmount && parseFloat(actualAmount) !== req.approvedAmount && (
              <div className="flex items-center gap-2 mt-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl">
                <AlertTriangle size={14} className="text-amber-600 flex-shrink-0"/>
                <p className="text-[13px] text-amber-800 font-semibold">
                  Difference of {fmt(Math.abs(parseFloat(actualAmount) - req.approvedAmount))} detected.
                  Finance will review this discrepancy.
                </p>
              </div>
            )}
            {actualAmount && parseFloat(actualAmount) === req.approvedAmount && (
              <div className="flex items-center gap-2 mt-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl">
                <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0"/>
                <p className="text-[13px] text-emerald-800 font-semibold">Amount matches the released amount.</p>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="text-[15px] font-bold text-[#1a2e3f] block mb-2">
              Additional Notes <span className="text-[13px] font-normal text-slate-400">(optional)</span>
            </label>
            <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)}
              placeholder="Explain any differences or provide additional context…"
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-[14px] text-[#1a2e3f] outline-none focus:border-[#00355f] focus:ring-4 focus:ring-[#00355f]/10 transition-all resize-none leading-relaxed"/>
          </div>
        </div>

        {/* Footer */}
        <div className="px-7 py-5 border-t border-slate-100 bg-slate-50 flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-3.5 border-2 border-slate-200 text-slate-600 text-[15px] font-bold rounded-xl hover:bg-slate-100 transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#00355f] hover:bg-[#0f4c81] text-white text-[15px] font-bold rounded-xl transition-colors">
            <Upload size={18}/> Submit Receipt
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── View Receipt Modal ───────────────────────────────────────────────────────
function ViewReceiptModal({ req, onClose }: { req: MyRequest; onClose: () => void }) {
  const sm = STATUS_META[req.status];
  const rm = RECEIPT_META[req.receiptStatus];
  const diff = req.actualAmount !== undefined ? req.actualAmount - req.approvedAmount : null;
  const hasMismatch = diff !== null && diff !== 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="px-7 py-6" style={{ background:"linear-gradient(135deg,#00355f,#0f4c81)" }}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[12px] font-bold text-white/60 font-mono">{req.requestNo}</p>
              <h2 className="text-[18px] font-extrabold text-white mt-1">{req.description}</h2>
            </div>
            <button onClick={onClose} className="text-white/60 hover:text-white"><X size={20}/></button>
          </div>
        </div>

        <div className="px-7 py-6 space-y-5">
          {/* Status badges */}
          <div className="flex gap-2 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 text-[13px] font-bold px-3 py-1.5 rounded-full ${sm.bg} ${sm.text}`}>
              <span className={`w-2 h-2 rounded-full ${sm.dot}`}/>{req.status}
            </span>
            <span className={`text-[13px] font-bold px-3 py-1.5 rounded-full ${rm.bg} ${rm.text}`}>
              {rm.label}
            </span>
          </div>

          {/* Finance note */}
          {req.financeNote && (
            <div className="flex gap-3 p-4 rounded-xl border border-red-200 bg-red-50">
              <AlertTriangle size={16} className="text-red-600 flex-shrink-0 mt-0.5"/>
              <div>
                <p className="text-[12px] font-bold text-red-700 uppercase tracking-widest mb-1">Finance Note</p>
                <p className="text-[13px] text-red-700 leading-relaxed">{req.financeNote}</p>
              </div>
            </div>
          )}

          {/* Amounts */}
          <div className={`p-4 rounded-xl border-2 ${hasMismatch ? "border-red-200 bg-red-50" : "border-slate-100 bg-slate-50"}`}>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">Amount Summary</p>
            <div className="space-y-2.5">
              <div className="flex justify-between">
                <span className="text-[14px] text-slate-500">Released by Finance</span>
                <span className="text-[15px] font-bold text-[#1a2e3f]">{fmt(req.approvedAmount)}</span>
              </div>
              {req.actualAmount !== undefined && (
                <div className="flex justify-between pt-2 border-t border-slate-200">
                  <span className="text-[14px] text-slate-500">Actual (Your Receipt)</span>
                  <span className={`text-[15px] font-bold ${hasMismatch ? "text-red-600" : "text-emerald-600"}`}>
                    {fmt(req.actualAmount)}
                  </span>
                </div>
              )}
              {hasMismatch && diff !== null && (
                <div className="flex items-center gap-2 px-3 py-2 bg-red-100 rounded-lg mt-1">
                  <AlertTriangle size={13} className="text-red-600 flex-shrink-0"/>
                  <span className="text-[13px] font-bold text-red-700">
                    Difference: {fmt(Math.abs(diff))} {diff < 0 ? "(under)" : "(over)"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Receipt file */}
          {req.receiptFile && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <FileText size={18} className="text-blue-600"/>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-[#1a2e3f] truncate">{req.receiptFile}</p>
                <p className="text-[12px] text-slate-400">Uploaded {req.receiptUploadDate}</p>
              </div>
              <button className="flex items-center gap-1 text-[12px] font-bold text-[#00355f] hover:underline">
                <Eye size={13}/> View
              </button>
            </div>
          )}

          <button onClick={onClose}
            className="w-full py-3.5 bg-[#00355f] hover:bg-[#0f4c81] text-white text-[15px] font-bold rounded-xl transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function ToastContainer({ toasts, dismiss }: { toasts: Toast[]; dismiss: (id: number) => void }) {
  return (
    <div className="fixed top-5 right-5 z-[100] space-y-2 min-w-[300px]">
      {toasts.map((t) => (
        <div key={t.id} className={`flex items-center gap-3 px-4 py-3.5 rounded-xl shadow-lg border text-[14px] font-semibold ${
          t.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800" :
          t.type === "warning" ? "bg-amber-50 border-amber-200 text-amber-800" :
          "bg-red-50 border-red-200 text-red-700"
        }`}>
          {t.type === "success" ? <CheckCircle2 size={18}/> : t.type === "warning" ? <AlertTriangle size={18}/> : <X size={18}/>}
          <span className="flex-1">{t.message}</span>
          <button onClick={() => dismiss(t.id)} className="opacity-50 hover:opacity-100"><X size={16}/></button>
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function EmployeeReceiptPage() {
  const [requests,   setRequests]   = useState<MyRequest[]>(MY_REQUESTS);
  const [search,     setSearch]     = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "action-needed" | "completed">("All");
  const [uploadReq,  setUploadReq]  = useState<MyRequest | null>(null);
  const [viewReq,    setViewReq]    = useState<MyRequest | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [toasts,     setToasts]     = useState<Toast[]>([]);

  useEffect(() => { setTimeout(() => setLoading(false), 700); }, []);

  const addToast = (type: Toast["type"], message: string) => {
    const id = Date.now();
    setToasts((p) => [...p, { id, type, message }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4500);
  };
  const dismiss = (id: number) => setToasts((p) => p.filter((t) => t.id !== id));

  const handleUploadSubmit = (id: number, files: UploadFile[], actualAmount: string, notes: string) => {
    const amt    = parseFloat(actualAmount);
    const req    = requests.find((r) => r.id === id);
    const isSame = req && Math.abs(amt - req.approvedAmount) < 0.01;

    setRequests((p) => p.map((r) => r.id === id ? {
      ...r,
      status:            "Receipt Under Review",
      receiptStatus:     "Uploaded",
      receiptFile:       files[0]?.name,
      receiptUploadDate: new Date().toISOString().slice(0, 10),
      actualAmount:      amt,
    } : r));

    setUploadReq(null);

    if (isSame) {
      addToast("success", "✅ Receipt uploaded successfully! Finance will verify shortly.");
    } else {
      addToast("warning", "⚠️ Receipt uploaded with a different amount. Finance will review the discrepancy.");
    }
  };

  // Counts
  const actionNeeded = requests.filter((r) => r.status === "Awaiting Receipt" || r.status === "Mismatch Detected").length;
  const underReview  = requests.filter((r) => r.status === "Receipt Under Review").length;
  const completed    = requests.filter((r) => r.status === "Completed").length;

  const filtered = requests.filter((r) => {
    const q = search.toLowerCase();
    const matchQ = r.requestNo.toLowerCase().includes(q) || r.description.toLowerCase().includes(q);
    const matchFilter =
      statusFilter === "All" ? true :
      statusFilter === "action-needed" ? (r.status === "Awaiting Receipt" || r.status === "Mismatch Detected") :
      r.status === "Completed" || r.status === "Receipt Under Review";
    return matchQ && matchFilter;
  });

  const canUpload = (r: MyRequest) => r.status === "Awaiting Receipt" || r.status === "Mismatch Detected";

  return (
    <main className="ml-[270px] mt-16 min-h-[calc(100vh-64px)] bg-[#f7f9fb] overflow-y-auto">
      <ToastContainer toasts={toasts} dismiss={dismiss}/>

      <div className="px-8 py-8 max-w-4xl mx-auto space-y-6">

        {/* ── Header ────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#00355f] flex items-center justify-center flex-shrink-0">
            <Receipt size={22} color="white"/>
          </div>
          <div>
            <h1 className="text-[24px] font-extrabold text-[#00355f] leading-tight">My Receipt Submissions</h1>
            <p className="text-[15px] text-slate-500 mt-0.5">
              Upload your official receipts for cash that has been released to you.
            </p>
          </div>
        </div>

        {/* ── Summary cards ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label:"Action Needed",  value: actionNeeded, icon:<AlertTriangle size={22} className="text-orange-600"/>, color:"bg-orange-50", filter:"action-needed" as const },
            { label:"Under Review",   value: underReview,  icon:<Clock size={22} className="text-purple-600"/>,         color:"bg-purple-50", filter:"All" as const            },
            { label:"Completed",      value: completed,    icon:<CheckCircle2 size={22} className="text-emerald-600"/>, color:"bg-emerald-50",filter:"completed" as const       },
          ].map(({ label, value, icon, color, filter }) => (
            <button key={label} onClick={() => setStatusFilter(filter)}
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl border-2 text-left transition-all ${
                statusFilter === filter ? "border-[#00355f] bg-[#00355f] shadow-sm" : `border-slate-200 bg-white hover:border-[#00355f]/30`
              }`}>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${statusFilter === filter ? "bg-white/15" : color}`}>
                {icon}
              </div>
              <div>
                <p className={`text-[12px] font-bold uppercase tracking-widest ${statusFilter === filter ? "text-white/70" : "text-slate-400"}`}>{label}</p>
                <p className={`text-[24px] font-extrabold ${statusFilter === filter ? "text-white" : "text-[#00355f]"}`}>{value}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Action needed banner */}
        {actionNeeded > 0 && (
          <div className="flex items-center gap-3 px-5 py-3.5 rounded-xl border border-orange-200 bg-orange-50">
            <AlertTriangle size={18} className="text-orange-600 flex-shrink-0"/>
            <p className="text-[15px] font-semibold text-orange-800">
              You have <span className="font-extrabold">{actionNeeded}</span> request{actionNeeded > 1 ? "s" : ""} that require receipt submission.
            </p>
          </div>
        )}

        {/* ── Search + filter ────────────────────────────────────────────── */}
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"/>
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by request number or description…"
              className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-200 rounded-xl text-[14px] text-[#1a2e3f] outline-none focus:border-[#00355f] focus:ring-4 focus:ring-[#00355f]/10 transition-all"/>
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)}
            className="border-2 border-slate-200 rounded-xl px-4 py-2.5 text-[14px] text-[#1a2e3f] outline-none focus:border-[#00355f]">
            <option value="All">All Requests</option>
            <option value="action-needed">Action Needed</option>
            <option value="completed">Done</option>
          </select>
        </div>

        {/* ── Request cards ──────────────────────────────────────────────── */}
        {loading ? (
          <div className="py-20 flex flex-col items-center gap-3">
            <Loader2 size={32} className="text-[#00355f] animate-spin"/>
            <p className="text-[15px] font-semibold text-slate-400">Loading your requests…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 flex flex-col items-center gap-3 bg-white rounded-2xl border border-slate-200">
            <Receipt size={36} className="text-slate-300"/>
            <p className="text-[16px] font-bold text-slate-400">No requests found</p>
            <p className="text-[13px] text-slate-300">Cash-released requests will appear here for receipt submission.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((r) => {
              const sm         = STATUS_META[r.status];
              const rm         = RECEIPT_META[r.receiptStatus];
              const needsAction = canUpload(r);
              const diff        = r.actualAmount !== undefined ? r.actualAmount - r.approvedAmount : null;
              const hasMismatch = diff !== null && diff !== 0;

              return (
                <div key={r.id}
                  className={`bg-white rounded-2xl border-2 shadow-sm overflow-hidden transition-all ${
                    r.status === "Mismatch Detected" ? "border-red-200" :
                    needsAction ? "border-orange-200" : "border-slate-200"
                  }`}>

                  {/* Card top strip */}
                  {r.status === "Mismatch Detected" && (
                    <div className="h-1 w-full bg-red-400"/>
                  )}
                  {r.status === "Awaiting Receipt" && (
                    <div className="h-1 w-full bg-orange-400"/>
                  )}

                  <div className="p-6">
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[12px] font-bold text-slate-400 font-mono">{r.requestNo}</span>
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${rm.bg} ${rm.text}`}>{rm.label}</span>
                        </div>
                        <h3 className="text-[17px] font-extrabold text-[#1a2e3f] leading-tight">{r.description}</h3>
                        <p className="text-[13px] text-slate-400 mt-1">{r.department} · {r.category}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 text-[12px] font-bold px-2.5 py-1.5 rounded-full flex-shrink-0 ${sm.bg} ${sm.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sm.dot}`}/>{r.status}
                      </span>
                    </div>

                    {/* Amount row */}
                    <div className="flex flex-wrap gap-4 mb-4">
                      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 border border-indigo-100">
                        <Wallet size={16} className="text-indigo-600"/>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Released</p>
                          <p className="text-[16px] font-extrabold text-indigo-700">{fmt(r.approvedAmount)}</p>
                        </div>
                      </div>
                      {r.actualAmount !== undefined && (
                        <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border ${
                          hasMismatch ? "bg-red-50 border-red-200" : "bg-emerald-50 border-emerald-200"
                        }`}>
                          <Receipt size={16} className={hasMismatch ? "text-red-600" : "text-emerald-600"}/>
                          <div>
                            <p className={`text-[10px] font-bold uppercase tracking-widest ${hasMismatch ? "text-red-400" : "text-emerald-400"}`}>
                              Receipt Amount
                            </p>
                            <p className={`text-[16px] font-extrabold ${hasMismatch ? "text-red-700" : "text-emerald-700"}`}>
                              {fmt(r.actualAmount)}
                            </p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-slate-400"/>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Released on</p>
                          <p className="text-[13px] font-semibold text-slate-600">{r.releasedDate}</p>
                        </div>
                      </div>
                    </div>

                    {/* Finance mismatch note */}
                    {r.status === "Mismatch Detected" && r.financeNote && (
                      <div className="flex gap-3 p-4 rounded-xl border border-red-200 bg-red-50 mb-4">
                        <AlertTriangle size={16} className="text-red-600 flex-shrink-0 mt-0.5"/>
                        <div>
                          <p className="text-[12px] font-bold text-red-700 uppercase tracking-widest mb-1">Finance Note</p>
                          <p className="text-[13px] text-red-700 leading-relaxed">{r.financeNote}</p>
                        </div>
                      </div>
                    )}

                    {/* Uploaded receipt info */}
                    {r.receiptFile && (
                      <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                          <FileText size={15} className="text-blue-600"/>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-[#1a2e3f] truncate">{r.receiptFile}</p>
                          <p className="text-[11px] text-slate-400">Submitted {r.receiptUploadDate}</p>
                        </div>
                        <button onClick={() => setViewReq(r)}
                          className="flex items-center gap-1 text-[12px] font-bold text-[#00355f] hover:underline flex-shrink-0">
                          <Eye size={13}/> View
                        </button>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 flex-wrap">
                      <button onClick={() => setViewReq(r)}
                        className="flex items-center gap-2 px-4 py-2.5 border-2 border-slate-200 text-[14px] font-bold text-[#00355f] rounded-xl hover:bg-slate-50 transition-colors">
                        <Eye size={15}/> View Details
                      </button>

                      {needsAction && (
                        <button onClick={() => setUploadReq(r)}
                          className={`flex items-center gap-2 px-5 py-2.5 text-white text-[14px] font-bold rounded-xl transition-colors ${
                            r.status === "Mismatch Detected"
                              ? "bg-red-500 hover:bg-red-600"
                              : "bg-[#00355f] hover:bg-[#0f4c81]"
                          }`}>
                          <Upload size={15}/>
                          {r.status === "Mismatch Detected" ? "Resubmit Receipt" : "Upload Receipt"}
                          <ArrowRight size={14}/>
                        </button>
                      )}

                      {r.status === "Receipt Under Review" && (
                        <span className="flex items-center gap-2 px-5 py-2.5 bg-purple-50 text-purple-700 text-[14px] font-bold rounded-xl border border-purple-200">
                          <Clock size={15}/> Finance is reviewing your receipt
                        </span>
                      )}

                      {r.status === "Completed" && (
                        <span className="flex items-center gap-2 px-5 py-2.5 bg-emerald-50 text-emerald-700 text-[14px] font-bold rounded-xl border border-emerald-200">
                          <CheckCircle2 size={15}/> Request completed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      {uploadReq && (
        <UploadModal req={uploadReq} onClose={() => setUploadReq(null)} onSubmit={handleUploadSubmit}/>
      )}
      {viewReq && (
        <ViewReceiptModal req={viewReq} onClose={() => setViewReq(null)}/>
      )}
    </main>
  );
}