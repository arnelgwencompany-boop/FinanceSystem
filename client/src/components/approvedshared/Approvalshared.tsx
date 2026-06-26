import { useState } from "react";
import {
  CheckCircle2, XCircle, X, Clock, CheckCheck,
  FileText, User, Building2, Calendar, DollarSign, Hash, AlertTriangle,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
export type Role      = "supervisor" | "director";
export type ReqStatus = "Pending" | "Supervisor Approved" | "Fully Approved" | "Rejected";
export type FilterTab = "All" | ReqStatus;

export interface Request {
  id: number;
  requestNo: string;
  requestedBy: string;
  department: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  status: ReqStatus;
  priority: "Low" | "Medium" | "High";
  notes?: string;
}

export interface Toast { id: number; type: "success" | "error"; message: string; }

// ─── Shared mock data ─────────────────────────────────────────────────────────
export const MOCK_REQUESTS: Request[] = [
  { id: 1,  requestNo: "REQ-2026-001", requestedBy: "Juan dela Cruz",  department: "IT Ops",    amount: 3000.90,  description: "Headphone set (500 pcs)",              category: "IT Equipment",    date: "2026-06-15", status: "Pending",             priority: "High",   notes: "Urgently needed for new hires." },
  { id: 2,  requestNo: "REQ-2026-002", requestedBy: "Ana Lim",         department: "Marketing", amount: 1500.00,  description: "Printer cartridges (bulk)",             category: "Office Supplies", date: "2026-06-16", status: "Pending",             priority: "Medium", notes: "" },
  { id: 3,  requestNo: "REQ-2026-003", requestedBy: "Carlos Reyes",    department: "IT Ops",    amount: 8500.00,  description: "Network Switch (24-port)",              category: "IT Equipment",    date: "2026-06-17", status: "Supervisor Approved", priority: "High",   notes: "Approved by Supervisor Santos." },
  { id: 4,  requestNo: "REQ-2026-004", requestedBy: "Rosa Tan",        department: "GO",        amount: 950.00,   description: "Office supplies Q1 restock",           category: "Office Supplies", date: "2026-06-18", status: "Pending",             priority: "Low",    notes: "" },
  { id: 5,  requestNo: "REQ-2026-005", requestedBy: "Paolo Mendoza",   department: "Marketing", amount: 4200.00,  description: "UPS Battery Backup for workstations",  category: "IT Equipment",    date: "2026-06-19", status: "Rejected",            priority: "Medium", notes: "Exceeds single transaction limit." },
  { id: 6,  requestNo: "REQ-2026-006", requestedBy: "Lena Cruz",       department: "HR",        amount: 650.00,   description: "Team snacks for onboarding event",     category: "Meals & Snacks",  date: "2026-06-20", status: "Pending",             priority: "Low",    notes: "" },
  { id: 7,  requestNo: "REQ-2026-007", requestedBy: "Jose Garcia",     department: "GA",        amount: 12000.00, description: "Office furniture replacement",         category: "Maintenance",     date: "2026-06-21", status: "Supervisor Approved", priority: "High",   notes: "Pending director review." },
  { id: 8,  requestNo: "REQ-2026-008", requestedBy: "Maria Santos",    department: "Finance",   amount: 2800.00,  description: "Software license renewal Q3",          category: "IT Equipment",    date: "2026-06-22", status: "Fully Approved",      priority: "High",   notes: "All approvals done." },
  { id: 9,  requestNo: "REQ-2026-009", requestedBy: "Ben Torres",      department: "IT Ops",    amount: 500.00,   description: "USB hubs and cables for dev desks",    category: "IT Equipment",    date: "2026-06-23", status: "Pending",             priority: "Low",    notes: "" },
  { id: 10, requestNo: "REQ-2026-010", requestedBy: "Claire Sy",       department: "Marketing", amount: 3750.00,  description: "Event backdrop and tarpaulin printing",category: "Marketing",       date: "2026-06-24", status: "Supervisor Approved", priority: "Medium", notes: "" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
export const statusMeta: Record<ReqStatus, { label: string; dot: string; bg: string; text: string }> = {
  "Pending":             { label: "Pending",        dot: "bg-amber-400",   bg: "bg-amber-50",   text: "text-amber-700"   },
  "Supervisor Approved": { label: "Sup. Approved",  dot: "bg-blue-400",    bg: "bg-blue-50",    text: "text-blue-700"    },
  "Fully Approved":      { label: "Fully Approved", dot: "bg-emerald-500", bg: "bg-emerald-50", text: "text-emerald-700" },
  "Rejected":            { label: "Rejected",       dot: "bg-red-500",     bg: "bg-red-50",     text: "text-red-600"     },
};

export const priorityMeta: Record<string, { bg: string; text: string }> = {
  Low:    { bg: "bg-slate-100", text: "text-slate-600"  },
  Medium: { bg: "bg-blue-100",  text: "text-blue-700"   },
  High:   { bg: "bg-red-100",   text: "text-red-600"    },
};

export const fmt = (n: number) =>
  `₱${n.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;

export const PAGE_SIZE = 6;

// ─── Toast container ──────────────────────────────────────────────────────────
export function ToastContainer({ toasts, dismiss }: { toasts: Toast[]; dismiss: (id: number) => void }) {
  return (
    <div className="fixed top-5 right-5 z-[100] space-y-2 min-w-[300px]">
      {toasts.map((t) => (
        <div key={t.id} className={`flex items-center gap-3 px-4 py-3.5 rounded-xl shadow-lg border text-[14px] font-semibold ${
          t.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 border-red-200 text-red-700"
        }`}>
          {t.type === "success" ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
          <span className="flex-1">{t.message}</span>
          <button onClick={() => dismiss(t.id)} className="opacity-50 hover:opacity-100"><X size={16} /></button>
        </div>
      ))}
    </div>
  );
}

// ─── Approval flow mini visual ────────────────────────────────────────────────
export function ApprovalFlow({ status }: { status: ReqStatus }) {
  const steps = ["Employee", "Supervisor", "Director", "Finance"];
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {steps.map((step, i) => {
        const done =
          i === 0 ||
          (i === 1 && (status === "Supervisor Approved" || status === "Fully Approved")) ||
          (i === 2 && status === "Fully Approved") ||
          (i === 3 && status === "Fully Approved");
        const current =
          (i === 1 && status === "Pending") ||
          (i === 2 && status === "Supervisor Approved");
        return (
          <div key={step} className="flex items-center gap-1">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold border-2 ${
                done    ? "bg-emerald-500 border-emerald-500 text-white" :
                current ? "bg-[#00355f] border-[#00355f] text-white" :
                          "bg-white border-slate-200 text-slate-400"
              }`}>
                {done ? <CheckCircle2 size={15} /> : i + 1}
              </div>
              <span className={`text-[10px] font-bold mt-1 text-center ${done || current ? "text-[#00355f]" : "text-slate-400"}`}>
                {step}
              </span>
            </div>
            {i < 3 && <div className={`h-0.5 w-5 mb-4 ${done ? "bg-emerald-400" : "bg-slate-200"}`} />}
          </div>
        );
      })}
    </div>
  );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────
export function DetailModal({ req, role, onClose, onApprove, onReject, acting, canAct }: {
  req: Request; role: Role; onClose: () => void;
  onApprove: (id: number) => void; onReject: (id: number) => void;
  acting: boolean; canAct: boolean;
}) {
  const sm = statusMeta[req.status];
  const pm = priorityMeta[req.priority];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="px-6 py-5 flex items-start justify-between"
          style={{ background: "linear-gradient(135deg,#00355f,#0f4c81)" }}>
          <div>
            <p className="text-[12px] font-bold text-white/60 font-mono">{req.requestNo}</p>
            <h2 className="text-[18px] font-extrabold text-white mt-0.5 leading-tight">{req.description}</h2>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white mt-1"><X size={20} /></button>
        </div>
        <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="flex gap-2 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 text-[13px] font-bold px-3 py-1 rounded-full ${sm.bg} ${sm.text}`}>
              <span className={`w-2 h-2 rounded-full ${sm.dot}`} />{sm.label}
            </span>
            <span className={`text-[12px] font-bold px-2.5 py-1 rounded-full ${pm.bg} ${pm.text}`}>
              {req.priority} Priority
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: <User size={15} />,       label: "Requested By", value: req.requestedBy },
              { icon: <Building2 size={15} />,  label: "Department",   value: req.department  },
              { icon: <DollarSign size={15} />, label: "Amount",       value: fmt(req.amount) },
              { icon: <Calendar size={15} />,   label: "Date Filed",   value: req.date        },
              { icon: <FileText size={15} />,   label: "Category",     value: req.category    },
              { icon: <Hash size={15} />,       label: "Request No.",  value: req.requestNo   },
            ].map(({ icon, label, value }) => (
              <div key={label} className="flex gap-2.5 items-start">
                <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-[#00355f] flex-shrink-0 mt-0.5">{icon}</div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
                  <p className="text-[14px] font-semibold text-[#1a2e3f] mt-0.5">{value}</p>
                </div>
              </div>
            ))}
          </div>
          {req.notes && (
            <div className="px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-[11px] font-bold uppercase tracking-widest text-amber-600 mb-1">Notes</p>
              <p className="text-[14px] text-amber-900">{req.notes}</p>
            </div>
          )}
          <div>
            <p className="text-[12px] font-bold uppercase tracking-widest text-slate-400 mb-3">Approval Flow</p>
            <ApprovalFlow status={req.status} />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <button onClick={onClose}
            className="px-5 py-2.5 border-2 border-slate-200 text-slate-600 text-[14px] font-bold rounded-xl hover:bg-slate-100 transition-colors">
            Close
          </button>
          {canAct && (
            <div className="flex gap-2">
              <button onClick={() => { onReject(req.id); onClose(); }} disabled={acting}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white text-[14px] font-bold rounded-xl transition-colors disabled:opacity-60">
                <XCircle size={16} /> Reject
              </button>
              <button onClick={() => { onApprove(req.id); onClose(); }} disabled={acting}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[14px] font-bold rounded-xl transition-colors disabled:opacity-60">
                <CheckCircle2 size={16} /> {role === "supervisor" ? "Approve" : "Final Approve"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Reject Modal ─────────────────────────────────────────────────────────────
export function RejectModal({ reqNo, onConfirm, onClose }: {
  reqNo: string; onConfirm: (reason: string) => void; onClose: () => void;
}) {
  const [reason, setReason] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-[17px] font-extrabold text-[#00355f]">Reject Request</h3>
            <p className="text-[13px] text-slate-400 mt-0.5">{reqNo}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
        </div>
        <div className="px-6 py-5 space-y-3">
          <label className="text-[14px] font-bold text-[#1a2e3f] block">
            Reason for rejection <span className="text-red-500">*</span>
          </label>
          <textarea rows={4} value={reason} onChange={(e) => setReason(e.target.value)}
            placeholder="Provide a clear reason so the employee can revise their request…"
            className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-[14px] text-[#1a2e3f] outline-none focus:border-red-400 focus:ring-4 focus:ring-red-50 transition-all resize-none" />
        </div>
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
          <button onClick={onClose}
            className="px-5 py-2.5 border-2 border-slate-200 text-slate-600 text-[14px] font-bold rounded-xl hover:bg-slate-100 transition-colors">
            Cancel
          </button>
          <button onClick={() => reason.trim() && onConfirm(reason)} disabled={!reason.trim()}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-[14px] font-bold rounded-xl transition-colors">
            <XCircle size={16} /> Confirm Reject
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Summary card ─────────────────────────────────────────────────────────────
export function SummaryCard({ label, count, icon, color, onClick, active }: {
  label: string; count: number; icon: React.ReactNode;
  color: string; onClick: () => void; active: boolean;
}) {
  return (
    <button onClick={onClick}
      className={`flex items-center gap-4 px-5 py-4 rounded-2xl border-2 text-left transition-all w-full ${
        active ? "border-[#00355f] bg-[#00355f] shadow-lg" : "border-slate-200 bg-white hover:border-[#00355f]/30"
      }`}>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${active ? "bg-white/15" : color}`}>
        {icon}
      </div>
      <div>
        <p className={`text-[12px] font-bold uppercase tracking-widest ${active ? "text-white/70" : "text-slate-400"}`}>{label}</p>
        <p className={`text-[24px] font-extrabold leading-tight mt-0.5 ${active ? "text-white" : "text-[#00355f]"}`}>{count}</p>
      </div>
    </button>
  );
}

// ─── useToast ─────────────────────────────────────────────────────────────────
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const add = (type: "success" | "error", message: string) => {
    const id = Date.now();
    setToasts((p) => [...p, { id, type, message }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4000);
  };
  const dismiss = (id: number) => setToasts((p) => p.filter((t) => t.id !== id));
  return { toasts, add, dismiss };
}