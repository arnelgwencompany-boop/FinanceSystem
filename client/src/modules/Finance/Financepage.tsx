import { useState, useEffect } from "react";
import {
  Wallet, FileText, Clock, CheckCircle2, XCircle, AlertTriangle,
  Search, Filter, ChevronDown, X, Eye, Upload, RefreshCw,
  DollarSign, Receipt, Ban, CheckCheck, Loader2, Inbox,
  ChevronLeft, ChevronRight, RotateCcw, Building2, User,
  Calendar, Hash, TrendingUp, ArrowUpRight,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type FinanceStatus =
  | "Pending Finance"
  | "Approved"
  | "Cash Released"
  | "Awaiting Receipt"
  | "Receipt Under Review"
  | "Mismatch Detected"
  | "Returned"
  | "Completed";

type ReceiptStatus = "Not Uploaded" | "Uploaded" | "Verified" | "Mismatch";
type CashReleaseStatus = "Pending" | "Released";

interface FinanceRequest {
  id: number;
  requestNo: string;
  employeeName: string;
  department: string;
  requestedAmount: number;
  approvedAmount: number;
  actualAmount: number | null;
  status: FinanceStatus;
  cashRelease: CashReleaseStatus;
  receiptStatus: ReceiptStatus;
  receiptUploadDate: string | null;
  date: string;
  description: string;
  category: string;
  priority: "Low" | "Medium" | "High";
  timeline: string[];
}

interface Toast { id: number; type: "success" | "error" | "warning"; message: string; }

// ─── Mock data ────────────────────────────────────────────────────────────────
const INITIAL_DATA: FinanceRequest[] = [
  {
    id: 1, requestNo: "REQ-2026-001", employeeName: "Juan dela Cruz",
    department: "IT Ops", requestedAmount: 3000.90, approvedAmount: 3000.90,
    actualAmount: 2985.00, status: "Mismatch Detected", cashRelease: "Released",
    receiptStatus: "Mismatch", receiptUploadDate: "2026-06-20", date: "2026-06-15",
    description: "Headphone set (500 pcs)", category: "IT Equipment", priority: "High",
    timeline: ["Requested", "Supervisor ✓", "Director ✓", "Finance ✓", "Released ✓", "Receipt ✓"],
  },
  {
    id: 2, requestNo: "REQ-2026-002", employeeName: "Ana Lim",
    department: "Marketing", requestedAmount: 1500.00, approvedAmount: 1500.00,
    actualAmount: null, status: "Awaiting Receipt", cashRelease: "Released",
    receiptStatus: "Not Uploaded", receiptUploadDate: null, date: "2026-06-16",
    description: "Printer cartridges (bulk)", category: "Office Supplies", priority: "Medium",
    timeline: ["Requested", "Supervisor ✓", "Director ✓", "Finance ✓", "Released ✓", "Receipt ⏳"],
  },
  {
    id: 3, requestNo: "REQ-2026-003", employeeName: "Carlos Reyes",
    department: "IT Ops", requestedAmount: 8500.00, approvedAmount: 8500.00,
    actualAmount: 8500.00, status: "Completed", cashRelease: "Released",
    receiptStatus: "Verified", receiptUploadDate: "2026-06-19", date: "2026-06-17",
    description: "Network Switch (24-port)", category: "IT Equipment", priority: "High",
    timeline: ["Requested", "Supervisor ✓", "Director ✓", "Finance ✓", "Released ✓", "Receipt ✓", "Completed ✓"],
  },
  {
    id: 4, requestNo: "REQ-2026-004", employeeName: "Rosa Tan",
    department: "GO", requestedAmount: 950.00, approvedAmount: 950.00,
    actualAmount: null, status: "Approved", cashRelease: "Pending",
    receiptStatus: "Not Uploaded", receiptUploadDate: null, date: "2026-06-18",
    description: "Office supplies Q1 restock", category: "Office Supplies", priority: "Low",
    timeline: ["Requested", "Supervisor ✓", "Director ✓", "Finance ✓", "Released ⏳"],
  },
  {
    id: 5, requestNo: "REQ-2026-005", employeeName: "Paolo Mendoza",
    department: "Marketing", requestedAmount: 4200.00, approvedAmount: 4200.00,
    actualAmount: null, status: "Pending Finance", cashRelease: "Pending",
    receiptStatus: "Not Uploaded", receiptUploadDate: null, date: "2026-06-19",
    description: "UPS Battery Backup", category: "IT Equipment", priority: "Medium",
    timeline: ["Requested", "Supervisor ✓", "Director ✓", "Finance ⏳"],
  },
  {
    id: 6, requestNo: "REQ-2026-006", employeeName: "Lena Cruz",
    department: "HR", requestedAmount: 650.00, approvedAmount: 650.00,
    actualAmount: 650.00, status: "Receipt Under Review", cashRelease: "Released",
    receiptStatus: "Uploaded", receiptUploadDate: "2026-06-22", date: "2026-06-20",
    description: "Team snacks for onboarding", category: "Meals & Snacks", priority: "Low",
    timeline: ["Requested", "Supervisor ✓", "Director ✓", "Finance ✓", "Released ✓", "Receipt ✓", "Review ⏳"],
  },
  {
    id: 7, requestNo: "REQ-2026-007", employeeName: "Jose Garcia",
    department: "GA", requestedAmount: 12000.00, approvedAmount: 12000.00,
    actualAmount: null, status: "Returned", cashRelease: "Pending",
    receiptStatus: "Not Uploaded", receiptUploadDate: null, date: "2026-06-21",
    description: "Office furniture replacement", category: "Maintenance", priority: "High",
    timeline: ["Requested", "Supervisor ✓", "Director ✓", "Finance ✗", "Returned"],
  },
  {
    id: 8, requestNo: "REQ-2026-008", employeeName: "Maria Santos",
    department: "Finance", requestedAmount: 2800.00, approvedAmount: 2800.00,
    actualAmount: null, status: "Cash Released", cashRelease: "Released",
    receiptStatus: "Not Uploaded", receiptUploadDate: null, date: "2026-06-22",
    description: "Software license renewal Q3", category: "IT Equipment", priority: "High",
    timeline: ["Requested", "Supervisor ✓", "Director ✓", "Finance ✓", "Released ✓", "Receipt ⏳"],
  },
  {
    id: 9, requestNo: "REQ-2026-009", employeeName: "Ben Torres",
    department: "IT Ops", requestedAmount: 500.00, approvedAmount: 500.00,
    actualAmount: null, status: "Pending Finance", cashRelease: "Pending",
    receiptStatus: "Not Uploaded", receiptUploadDate: null, date: "2026-06-23",
    description: "USB hubs and cables", category: "IT Equipment", priority: "Low",
    timeline: ["Requested", "Supervisor ✓", "Director ✓", "Finance ⏳"],
  },
  {
    id: 10, requestNo: "REQ-2026-010", employeeName: "Claire Sy",
    department: "Marketing", requestedAmount: 3750.00, approvedAmount: 3750.00,
    actualAmount: 3750.00, status: "Completed", cashRelease: "Released",
    receiptStatus: "Verified", receiptUploadDate: "2026-06-24", date: "2026-06-24",
    description: "Event backdrop printing", category: "Marketing", priority: "Medium",
    timeline: ["Requested", "Supervisor ✓", "Director ✓", "Finance ✓", "Released ✓", "Receipt ✓", "Completed ✓"],
  },
];

const PAGE_SIZE = 7;
const fmt = (n: number) => `₱${n.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_META: Record<FinanceStatus, { bg: string; text: string; dot: string; icon: React.ReactNode }> = {
  "Pending Finance":     { bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-400",   icon: <Clock size={12} />        },
  "Approved":            { bg: "bg-blue-50",    text: "text-blue-700",    dot: "bg-blue-400",    icon: <CheckCircle2 size={12} /> },
  "Cash Released":       { bg: "bg-indigo-50",  text: "text-indigo-700",  dot: "bg-indigo-400",  icon: <Wallet size={12} />       },
  "Awaiting Receipt":    { bg: "bg-orange-50",  text: "text-orange-700",  dot: "bg-orange-400",  icon: <Receipt size={12} />      },
  "Receipt Under Review":{ bg: "bg-purple-50",  text: "text-purple-700",  dot: "bg-purple-400",  icon: <Eye size={12} />          },
  "Mismatch Detected":   { bg: "bg-red-50",     text: "text-red-600",     dot: "bg-red-500",     icon: <AlertTriangle size={12} />},
  "Returned":            { bg: "bg-rose-50",    text: "text-rose-700",    dot: "bg-rose-500",    icon: <RotateCcw size={12} />    },
  "Completed":           { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", icon: <CheckCheck size={12} />   },
};

const RECEIPT_META: Record<ReceiptStatus, { bg: string; text: string }> = {
  "Not Uploaded": { bg: "bg-slate-100",  text: "text-slate-500"   },
  "Uploaded":     { bg: "bg-blue-100",   text: "text-blue-700"    },
  "Verified":     { bg: "bg-emerald-100",text: "text-emerald-700" },
  "Mismatch":     { bg: "bg-red-100",    text: "text-red-600"     },
};

const ALL_STATUSES: FinanceStatus[] = [
  "Pending Finance","Approved","Cash Released","Awaiting Receipt",
  "Receipt Under Review","Mismatch Detected","Returned","Completed",
];

// ─── Toast ────────────────────────────────────────────────────────────────────
function ToastContainer({ toasts, dismiss }: { toasts: Toast[]; dismiss: (id: number) => void }) {
  return (
    <div className="fixed top-5 right-5 z-[100] space-y-2 min-w-[320px]">
      {toasts.map((t) => (
        <div key={t.id} className={`flex items-center gap-3 px-4 py-3.5 rounded-xl shadow-lg border text-[14px] font-semibold ${
          t.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800" :
          t.type === "warning" ? "bg-amber-50 border-amber-200 text-amber-800" :
          "bg-red-50 border-red-200 text-red-700"
        }`}>
          {t.type === "success" ? <CheckCircle2 size={18}/> : t.type === "warning" ? <AlertTriangle size={18}/> : <XCircle size={18}/>}
          <span className="flex-1">{t.message}</span>
          <button onClick={() => dismiss(t.id)} className="opacity-50 hover:opacity-100"><X size={16}/></button>
        </div>
      ))}
    </div>
  );
}

// ─── Detail Drawer ────────────────────────────────────────────────────────────
function DetailDrawer({ req, onClose, onAction }: {
  req: FinanceRequest; onClose: () => void;
  onAction: (id: number, action: string) => void;
}) {
  const sm  = STATUS_META[req.status];
  const rm  = RECEIPT_META[req.receiptStatus];
  const diff = req.actualAmount !== null ? req.actualAmount - req.approvedAmount : null;
  const hasMismatch = diff !== null && diff !== 0;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="flex-1 bg-black/30" onClick={onClose} />
      <div className="w-[420px] bg-white h-full shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 flex-shrink-0" style={{ background: "linear-gradient(135deg,#00355f,#0f4c81)" }}>
          <div className="flex justify-between items-start mb-3">
            <span className={`inline-flex items-center gap-1.5 text-[12px] font-bold px-2.5 py-1 rounded-full ${sm.bg} ${sm.text}`}>
              {sm.icon} {req.status}
            </span>
            <button onClick={onClose} className="text-white/60 hover:text-white"><X size={20}/></button>
          </div>
          <p className="text-[12px] font-bold text-white/60 font-mono">{req.requestNo}</p>
          <h2 className="text-[18px] font-extrabold text-white mt-1 leading-tight">{req.description}</h2>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Amounts */}
          <div className={`p-4 rounded-xl border-2 ${hasMismatch ? "border-red-200 bg-red-50" : "border-slate-100 bg-slate-50"}`}>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">Amount Summary</p>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[14px] text-slate-600">Requested</span>
                <span className="text-[15px] font-bold text-[#1a2e3f]">{fmt(req.requestedAmount)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[14px] text-slate-600">Approved</span>
                <span className="text-[15px] font-bold text-[#1a2e3f]">{fmt(req.approvedAmount)}</span>
              </div>
              {req.actualAmount !== null && (
                <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                  <span className="text-[14px] text-slate-600">Actual (Receipt)</span>
                  <span className={`text-[15px] font-bold ${hasMismatch ? "text-red-600" : "text-emerald-600"}`}>
                    {fmt(req.actualAmount)}
                  </span>
                </div>
              )}
              {hasMismatch && diff !== null && (
                <div className="flex items-center gap-2 mt-2 px-3 py-2 bg-red-100 rounded-lg">
                  <AlertTriangle size={14} className="text-red-600 flex-shrink-0" />
                  <span className="text-[13px] font-bold text-red-700">
                    Difference: {fmt(Math.abs(diff))} {diff < 0 ? "(under)" : "(over)"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: <User size={14}/>,      label: "Employee",    value: req.employeeName   },
              { icon: <Building2 size={14}/>, label: "Department",  value: req.department     },
              { icon: <Hash size={14}/>,      label: "Category",    value: req.category       },
              { icon: <Calendar size={14}/>,  label: "Date Filed",  value: req.date           },
              { icon: <Receipt size={14}/>,   label: "Receipt",     value: req.receiptStatus  },
              { icon: <Calendar size={14}/>,  label: "Uploaded",    value: req.receiptUploadDate ?? "—" },
            ].map(({ icon, label, value }) => (
              <div key={label} className="flex gap-2 items-start">
                <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-[#00355f] flex-shrink-0">{icon}</div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
                  <p className="text-[13px] font-semibold text-[#1a2e3f] mt-0.5">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">Request Timeline</p>
            <div className="relative pl-5">
              {req.timeline.map((step, i) => {
                const done    = step.includes("✓");
                const issue   = step.includes("✗");
                const pending = step.includes("⏳");
                return (
                  <div key={i} className="flex items-start gap-3 pb-4 relative">
                    <div className={`absolute left-0 top-2 w-[2px] h-full ${
                      done ? "bg-emerald-300" : "bg-slate-200"
                    } ${i === req.timeline.length - 1 ? "hidden" : ""}`} />
                    <div className={`relative z-10 w-4 h-4 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center ${
                      done ? "bg-emerald-500" : issue ? "bg-red-500" : pending ? "bg-amber-400" : "bg-slate-200"
                    }`}>
                      {done    && <CheckCircle2 size={10} color="white" />}
                      {issue   && <X size={10} color="white" />}
                      {pending && <Clock size={10} color="white" />}
                    </div>
                    <span className={`text-[13px] font-semibold ${
                      done ? "text-emerald-700" : issue ? "text-red-600" : pending ? "text-amber-700" : "text-slate-400"
                    }`}>{step}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex-shrink-0 space-y-2">
          <ActionButtons req={req} onAction={(id, action) => { onAction(id, action); onClose(); }} compact={false} />
        </div>
      </div>
    </div>
  );
}

// ─── Dynamic Action Buttons ────────────────────────────────────────────────────
function ActionButtons({ req, onAction, compact }: {
  req: FinanceRequest; onAction: (id: number, action: string) => void; compact: boolean;
}) {
  const sz  = compact ? 13 : 15;
  const cls = compact
    ? "flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[12px] font-bold transition-colors"
    : "w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[14px] font-bold transition-colors";

  switch (req.status) {
    case "Pending Finance":
      return (
        <div className={`flex gap-2 ${compact ? "" : "flex-col"}`}>
          <button onClick={() => onAction(req.id, "approve")}
            className={`${cls} bg-emerald-600 hover:bg-emerald-700 text-white`}>
            <CheckCircle2 size={sz}/> Approve
          </button>
          <button onClick={() => onAction(req.id, "reject")}
            className={`${cls} bg-red-500 hover:bg-red-600 text-white`}>
            <XCircle size={sz}/> Reject
          </button>
        </div>
      );
    case "Approved":
      return (
        <button onClick={() => onAction(req.id, "release")}
          className={`${cls} bg-indigo-600 hover:bg-indigo-700 text-white`}>
          <Wallet size={sz}/> Release Cash
        </button>
      );
    case "Cash Released":
    case "Awaiting Receipt":
      return (
        <button className={`${cls} bg-orange-100 text-orange-700 cursor-default`} disabled>
          <Clock size={sz}/> Waiting for Receipt
        </button>
      );
    case "Receipt Under Review":
      return (
        <div className={`flex gap-2 ${compact ? "" : "flex-col"}`}>
          <button onClick={() => onAction(req.id, "verify")}
            className={`${cls} bg-emerald-600 hover:bg-emerald-700 text-white`}>
            <CheckCheck size={sz}/> Verify & Complete
          </button>
          <button onClick={() => onAction(req.id, "mismatch")}
            className={`${cls} bg-amber-500 hover:bg-amber-600 text-white`}>
            <AlertTriangle size={sz}/> Flag Mismatch
          </button>
        </div>
      );
    case "Mismatch Detected":
      return (
        <button onClick={() => onAction(req.id, "return")}
          className={`${cls} bg-rose-500 hover:bg-rose-600 text-white`}>
          <RotateCcw size={sz}/> Return to Employee
        </button>
      );
    case "Completed":
      return (
        <span className={`${cls} bg-emerald-50 text-emerald-700 cursor-default justify-center`}>
          <CheckCheck size={sz}/> Completed
        </span>
      );
    case "Returned":
      return (
        <span className={`${cls} bg-rose-50 text-rose-700 cursor-default justify-center`}>
          <Ban size={sz}/> Returned to Employee
        </span>
      );
    default:
      return null;
  }
}

// ─── Summary Card ─────────────────────────────────────────────────────────────
function SummaryCard({ label, value, icon, color, sub }: {
  label: string; value: number | string; icon: React.ReactNode; color: string; sub?: string;
}) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200 px-5 py-4 flex items-center gap-4 shadow-sm`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[12px] font-bold uppercase tracking-widest text-slate-400 leading-tight">{label}</p>
        <p className="text-[24px] font-extrabold text-[#00355f] leading-tight mt-0.5">{value}</p>
        {sub && <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function FinanceDashboard() {
  const [data,        setData]        = useState<FinanceRequest[]>(INITIAL_DATA);
  const [search,      setSearch]      = useState("");
  const [statusFilter,setStatusFilter]= useState<FinanceStatus | "All">("All");
  const [showFilters, setShowFilters] = useState(false);
  const [deptFilter,  setDeptFilter]  = useState("All");
  const [page,        setPage]        = useState(1);
  const [drawer,      setDrawer]      = useState<FinanceRequest | null>(null);
  const [loading,     setLoading]     = useState(true);
  const [activeTab,   setActiveTab]   = useState<"queue" | "monitoring">("queue");
  const [toasts,      setToasts]      = useState<Toast[]>([]);

  useEffect(() => { setTimeout(() => setLoading(false), 800); }, []);

  const addToast = (type: Toast["type"], message: string) => {
    const id = Date.now();
    setToasts((p) => [...p, { id, type, message }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4500);
  };

  const dismiss = (id: number) => setToasts((p) => p.filter((t) => t.id !== id));

  const handleAction = (id: number, action: string) => {
    setData((prev) => prev.map((r) => {
      if (r.id !== id) return r;
      switch (action) {
        case "approve":
          addToast("success", `${r.requestNo} approved and ready for cash release.`);
          return { ...r, status: "Approved" };
        case "reject":
          addToast("error", `${r.requestNo} has been rejected.`);
          return { ...r, status: "Returned" };
        case "release":
          addToast("success", `💰 Cash released for ${r.requestNo}.`);
          return { ...r, status: "Awaiting Receipt", cashRelease: "Released" };
        case "verify":
          addToast("success", `✅ ${r.requestNo} verified and marked as completed.`);
          return { ...r, status: "Completed", receiptStatus: "Verified" };
        case "mismatch":
          addToast("warning", `⚠️ Mismatch flagged for ${r.requestNo}.`);
          return { ...r, status: "Mismatch Detected", receiptStatus: "Mismatch" };
        case "return":
          addToast("error", `${r.requestNo} returned to employee for correction.`);
          return { ...r, status: "Returned" };
        default: return r;
      }
    }));
  };

  // Summary counts
  const counts = {
    total:     data.length,
    pending:   data.filter((r) => r.status === "Pending Finance").length,
    approved:  data.filter((r) => r.status === "Approved").length,
    released:  data.filter((r) => r.cashRelease === "Released").length,
    awaiting:  data.filter((r) => r.status === "Awaiting Receipt").length,
    completed: data.filter((r) => r.status === "Completed").length,
    returned:  data.filter((r) => r.status === "Returned").length,
    mismatch:  data.filter((r) => r.status === "Mismatch Detected").length,
  };

  const totalReleased = data
    .filter((r) => r.cashRelease === "Released")
    .reduce((s, r) => s + r.approvedAmount, 0);

  const departments = ["All", ...Array.from(new Set(data.map((r) => r.department)))];

  // Filter
  const filtered = data.filter((r) => {
    const q = search.toLowerCase();
    return (
      (r.requestNo.toLowerCase().includes(q) || r.employeeName.toLowerCase().includes(q)) &&
      (statusFilter === "All" || r.status === statusFilter) &&
      (deptFilter === "All" || r.department === deptFilter)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Monitoring data
  const monitoringData = data.filter((r) => r.cashRelease === "Released");

  return (
    <main className="ml-[270px] mt-16 min-h-[calc(100vh-64px)] bg-[#f7f9fb] overflow-y-auto">
      <ToastContainer toasts={toasts} dismiss={dismiss} />

      <div className="px-8 py-8 max-w-[1600px] mx-auto space-y-6">

        {/* ── Page Header ────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg,#059669,#047857)" }}>
              <Wallet size={22} color="white" />
            </div>
            <div>
              <h1 className="text-[24px] font-extrabold text-[#00355f] leading-tight">Finance Dashboard</h1>
              <p className="text-[15px] text-slate-500 mt-0.5">
                Manage cash releases, receipts, and final approvals.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border-2 border-emerald-200 bg-emerald-50">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-[13px] font-extrabold"
              style={{ background: "linear-gradient(135deg,#059669,#047857)" }}>FA</div>
            <div>
              <p className="text-[14px] font-bold text-[#00355f]">Finance Officer</p>
              <p className="text-[12px] text-emerald-600 font-semibold">Finance</p>
            </div>
          </div>
        </div>

        {/* ── Summary Cards ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3">
          <SummaryCard label="Total"            value={counts.total}     icon={<FileText size={22} className="text-[#00355f]"/>}    color="bg-slate-100"   />
          <SummaryCard label="Pending Review"   value={counts.pending}   icon={<Clock size={22} className="text-amber-600"/>}        color="bg-amber-50"    />
          <SummaryCard label="Approved"         value={counts.approved}  icon={<CheckCircle2 size={22} className="text-blue-600"/>}  color="bg-blue-50"     />
          <SummaryCard label="Cash Released"    value={counts.released}  icon={<Wallet size={22} className="text-indigo-600"/>}      color="bg-indigo-50"   />
          <SummaryCard label="Await Receipt"    value={counts.awaiting}  icon={<Receipt size={22} className="text-orange-600"/>}     color="bg-orange-50"   />
          <SummaryCard label="Completed"        value={counts.completed} icon={<CheckCheck size={22} className="text-emerald-600"/>} color="bg-emerald-50"  />
          <SummaryCard label="Returned"         value={counts.returned}  icon={<RotateCcw size={22} className="text-rose-600"/>}     color="bg-rose-50"     />
          <SummaryCard label="Mismatch"         value={counts.mismatch}  icon={<AlertTriangle size={22} className="text-red-600"/>}  color="bg-red-50"      />
        </div>

        {/* Total released banner */}
        <div className="flex items-center justify-between px-6 py-4 rounded-2xl border border-emerald-200 bg-emerald-50">
          <div className="flex items-center gap-3">
            <TrendingUp size={20} className="text-emerald-600" />
            <div>
              <p className="text-[13px] font-bold text-emerald-600 uppercase tracking-widest">Total Cash Released This Period</p>
              <p className="text-[22px] font-extrabold text-emerald-800">{fmt(totalReleased)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-emerald-700 text-[13px] font-semibold">
            <ArrowUpRight size={16}/> {counts.released} transactions
          </div>
        </div>

        {/* ── Tabs ─────────────────────────────────────────────────────── */}
        <div className="flex gap-1 bg-white border border-slate-200 rounded-2xl p-1.5 shadow-sm w-fit">
          {[
            { key: "queue",      label: "Finance Queue",   icon: <FileText size={15}/>  },
            { key: "monitoring", label: "Cash Monitoring", icon: <DollarSign size={15}/> },
          ].map(({ key, label, icon }) => (
            <button key={key} onClick={() => setActiveTab(key as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[14px] font-bold transition-all ${
                activeTab === key
                  ? "bg-[#00355f] text-white shadow-sm"
                  : "text-slate-500 hover:text-[#00355f]"
              }`}>
              {icon}{label}
            </button>
          ))}
        </div>

        {/* ── FINANCE QUEUE ─────────────────────────────────────────────── */}
        {activeTab === "queue" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

            {/* Search + filter bar */}
            <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap gap-3 items-center">
              <div className="relative flex-1 min-w-[200px]">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search by name or request number…"
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-200 rounded-xl text-[14px] text-[#1a2e3f] outline-none focus:border-[#00355f] focus:ring-4 focus:ring-[#00355f]/10 transition-all" />
              </div>

              <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value as any); setPage(1); }}
                className="border-2 border-slate-200 rounded-xl px-3 py-2.5 text-[14px] text-[#1a2e3f] outline-none focus:border-[#00355f]">
                <option value="All">All Status</option>
                {ALL_STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>

              <button onClick={() => setShowFilters((v) => !v)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-[14px] font-bold transition-all ${
                  showFilters ? "bg-[#00355f] text-white border-[#00355f]" : "bg-white text-slate-600 border-slate-200 hover:border-[#00355f]/40"
                }`}>
                <Filter size={15}/> Filters
                <ChevronDown size={14} className={`transition-transform ${showFilters ? "rotate-180" : ""}`}/>
              </button>
            </div>

            {showFilters && (
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex gap-4 flex-wrap">
                <div className="flex flex-col gap-1">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Department</p>
                  <select value={deptFilter} onChange={(e) => { setDeptFilter(e.target.value); setPage(1); }}
                    className="border-2 border-slate-200 rounded-xl px-3 py-2 text-[14px] text-[#1a2e3f] outline-none focus:border-[#00355f]">
                    {departments.map((d) => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="flex items-end">
                  <button onClick={() => { setDeptFilter("All"); setStatusFilter("All"); setSearch(""); setPage(1); }}
                    className="px-4 py-2 text-[13px] font-bold text-red-500 border-2 border-red-200 rounded-xl hover:bg-red-50 transition-colors">
                    Clear
                  </button>
                </div>
              </div>
            )}

            {/* Table */}
            {loading ? (
              <div className="py-20 flex flex-col items-center gap-3">
                <Loader2 size={32} className="text-[#00355f] animate-spin"/>
                <p className="text-[15px] font-semibold text-slate-400">Loading finance queue…</p>
              </div>
            ) : paginated.length === 0 ? (
              <div className="py-20 flex flex-col items-center gap-3">
                <Inbox size={36} className="text-slate-300"/>
                <p className="text-[16px] font-bold text-slate-400">No requests found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1100px]">
                  <thead>
                    <tr className="border-b border-slate-100">
                      {["Request No","Employee","Department","Requested","Approved","Status","Cash Release","Receipt","Date","Actions"].map((h) => (
                        <th key={h} className="px-4 py-3.5 text-left text-[11px] font-bold uppercase tracking-widest text-slate-400 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {paginated.map((r) => {
                      const sm   = STATUS_META[r.status];
                      const rm   = RECEIPT_META[r.receiptStatus];
                      const diff = r.actualAmount !== null ? r.actualAmount - r.approvedAmount : null;
                      const hasMismatch = diff !== null && diff !== 0;
                      return (
                        <tr key={r.id}
                          className={`transition-colors ${hasMismatch ? "bg-red-50/50 hover:bg-red-50" : "hover:bg-slate-50"}`}>
                          <td className="px-4 py-4">
                            <span className="text-[13px] font-bold text-[#00355f] font-mono">{r.requestNo}</span>
                          </td>
                          <td className="px-4 py-4">
                            <p className="text-[14px] font-bold text-[#1a2e3f]">{r.employeeName}</p>
                            <p className="text-[11px] text-slate-400 truncate max-w-[130px]">{r.description}</p>
                          </td>
                          <td className="px-4 py-4 text-[13px] font-semibold text-slate-600 whitespace-nowrap">{r.department}</td>
                          <td className="px-4 py-4 text-[14px] font-bold text-slate-700 whitespace-nowrap">{fmt(r.requestedAmount)}</td>
                          <td className="px-4 py-4 text-[14px] font-extrabold text-[#00355f] whitespace-nowrap">{fmt(r.approvedAmount)}</td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-1 rounded-full whitespace-nowrap ${sm.bg} ${sm.text}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${sm.dot}`}/>
                              {r.status}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full ${
                              r.cashRelease === "Released"
                                ? "bg-indigo-100 text-indigo-700"
                                : "bg-slate-100 text-slate-500"
                            }`}>
                              {r.cashRelease === "Released" ? "💰 Released" : "⏳ Pending"}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full ${rm.bg} ${rm.text}`}>
                              {r.receiptStatus === "Uploaded" || r.receiptStatus === "Verified" ? "📄 " : r.receiptStatus === "Mismatch" ? "⚠️ " : ""}
                              {r.receiptStatus}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-[12px] text-slate-500 whitespace-nowrap">{r.date}</td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <button onClick={() => setDrawer(r)}
                                className="flex items-center gap-1 px-2.5 py-1.5 border-2 border-slate-200 text-[12px] font-bold text-[#00355f] rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap">
                                <Eye size={13}/> View
                              </button>
                              <ActionButtons req={r} onAction={handleAction} compact={true}/>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {!loading && filtered.length > PAGE_SIZE && (
              <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                <p className="text-[13px] text-slate-400">
                  Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
                </p>
                <div className="flex items-center gap-2">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                    className="w-9 h-9 flex items-center justify-center rounded-xl border-2 border-slate-200 text-slate-500 hover:border-[#00355f] disabled:opacity-40">
                    <ChevronLeft size={16}/>
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button key={p} onClick={() => setPage(p)}
                      className={`w-9 h-9 flex items-center justify-center rounded-xl border-2 text-[14px] font-bold transition-colors ${
                        p === page ? "bg-[#00355f] border-[#00355f] text-white" : "border-slate-200 text-slate-500 hover:border-[#00355f]"
                      }`}>{p}</button>
                  ))}
                  <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    className="w-9 h-9 flex items-center justify-center rounded-xl border-2 border-slate-200 text-slate-500 hover:border-[#00355f] disabled:opacity-40">
                    <ChevronRight size={16}/>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── CASH MONITORING TAB ───────────────────────────────────────── */}
        {activeTab === "monitoring" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-[17px] font-bold text-[#00355f]">Cash Monitoring</h3>
              <p className="text-[13px] text-slate-500 mt-0.5">Track released cash against actual receipt amounts.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-slate-100">
                    {["Request No","Employee","Released Amount","Actual Amount","Difference","Upload Date","Receipt Status","Status"].map((h) => (
                      <th key={h} className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-widest text-slate-400 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {monitoringData.map((r) => {
                    const diff      = r.actualAmount !== null ? r.actualAmount - r.approvedAmount : null;
                    const hasIssue  = diff !== null && diff !== 0;
                    const rm        = RECEIPT_META[r.receiptStatus];
                    return (
                      <tr key={r.id} className={`transition-colors ${hasIssue ? "bg-red-50/50 hover:bg-red-50" : "hover:bg-slate-50"}`}>
                        <td className="px-5 py-4 text-[13px] font-bold text-[#00355f] font-mono whitespace-nowrap">{r.requestNo}</td>
                        <td className="px-5 py-4">
                          <p className="text-[14px] font-bold text-[#1a2e3f]">{r.employeeName}</p>
                          <p className="text-[11px] text-slate-400">{r.department}</p>
                        </td>
                        <td className="px-5 py-4 text-[14px] font-extrabold text-indigo-700 whitespace-nowrap">{fmt(r.approvedAmount)}</td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          {r.actualAmount !== null
                            ? <span className={`text-[14px] font-extrabold ${hasIssue ? "text-red-600" : "text-emerald-700"}`}>{fmt(r.actualAmount)}</span>
                            : <span className="text-[13px] text-slate-400">Not yet uploaded</span>
                          }
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          {diff !== null ? (
                            <span className={`inline-flex items-center gap-1 text-[13px] font-bold ${hasIssue ? "text-red-600" : "text-emerald-700"}`}>
                              {hasIssue ? <AlertTriangle size={14}/> : <CheckCircle2 size={14}/>}
                              {diff === 0 ? "No difference" : `${diff < 0 ? "-" : "+"}${fmt(Math.abs(diff))}`}
                            </span>
                          ) : <span className="text-[13px] text-slate-400">—</span>}
                        </td>
                        <td className="px-5 py-4 text-[13px] text-slate-500 whitespace-nowrap">
                          {r.receiptUploadDate ?? "—"}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1 text-[12px] font-bold px-2.5 py-1 rounded-full ${rm.bg} ${rm.text}`}>
                            {r.receiptStatus}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 text-[12px] font-bold px-2.5 py-1 rounded-full ${
                            r.status === "Completed" ? "bg-emerald-100 text-emerald-700" :
                            hasIssue ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-500"
                          }`}>
                            {r.status === "Completed" ? "✅ OK" : hasIssue ? "⚠️ Issue" : "⏳ Pending"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {monitoringData.length === 0 && (
              <div className="py-14 flex flex-col items-center gap-2">
                <Inbox size={32} className="text-slate-300"/>
                <p className="text-[14px] font-semibold text-slate-400">No released cash records yet.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Detail Drawer ─────────────────────────────────────────────────── */}
      {drawer && (
        <DetailDrawer
          req={drawer}
          onClose={() => setDrawer(null)}
          onAction={(id, action) => { handleAction(id, action); setDrawer(null); }}
        />
      )}
    </main>
  );
}