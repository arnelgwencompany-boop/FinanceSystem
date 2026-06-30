import { CheckCircle2, Clock, XCircle, FileText } from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────
interface Approval {
  id: number;
  role: string;
  status: "pending" | "approved" | "rejected";
  signed_by_name: string | null;
}

interface Request {
  id: number;
  request_no: string;
  description: string;
  date: string;
  amount: string;
  currency: string;
  status: "pending" | "approved" | "rejected";
  approvals: Approval[];
}

// ─── Mock Data ──────────────────────────────────────────────────────────
const REQUESTS: Request[] = [
  {
    id: 2,
    request_no: "REQ-00001",
    description: "Purchase of new laptop for development team",
    date: "2026-06-25",
    amount: "75000.00",
    currency: "PHP",
    status: "approved",
    approvals: [
      { id: 1, role: "supervisor", status: "approved", signed_by_name: "Supervisor Access" },
      { id: 2, role: "director", status: "approved", signed_by_name: "Director Access" },
      { id: 3, role: "finance", status: "approved", signed_by_name: "Finance Access" },
      { id: 4, role: "admin", status: "pending", signed_by_name: null },
    ],
  },
];

// ─── UI Helpers ────────────────────────────────────────────────────────
const getStatusBadge = (status: string) => {
  const styles = {
    approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
  };
  const icons = {
    approved: <CheckCircle2 size={14} />,
    pending: <Clock size={14} />,
    rejected: <XCircle size={14} />,
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status as keyof typeof styles]}`}>
      {icons[status as keyof typeof icons]}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default function EmployeeRequestList() {
  return (
    <div className="w-full max-w-5xl mx-auto py-10 px-4">
      <style>{`
        .doc-ink { color: #1a2e3f; }
        .doc-brand { color: #00355f; }
      `}</style>

      <div className="mb-8">
        <h2 className="text-2xl font-bold doc-ink">My Requests</h2>
        <p className="text-sm text-slate-500">Track the status of your submitted payment requests.</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-200 bg-slate-50/50">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-400">Request #</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-400">Description</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-400">Amount</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-400">Status</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-400">Progress</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {REQUESTS.map((req) => (
              <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 text-sm font-semibold doc-brand">{req.request_no}</td>
                <td className="px-6 py-4 text-sm font-medium doc-ink">{req.description}</td>
                <td className="px-6 py-4 text-sm doc-ink font-mono">
                  {req.currency} {parseFloat(req.amount).toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                </td>
                <td className="px-6 py-4">{getStatusBadge(req.status)}</td>
                <td className="px-6 py-4">
                  <div className="flex -space-x-1">
                    {req.approvals.map((app) => (
                      <div
                        key={app.id}
                        title={`${app.role}: ${app.status}`}
                        className={`h-6 w-6 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold ${
                          app.status === "approved" ? "bg-emerald-500 text-white" : "bg-zinc-200 text-zinc-500"
                        }`}
                      >
                        {app.role.charAt(0).toUpperCase()}
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {REQUESTS.length === 0 && (
          <div className="p-12 text-center text-slate-400">
            <FileText className="mx-auto mb-3" size={32} />
            <p className="text-sm font-medium">No requests found.</p>
          </div>
        )}
      </div>
    </div>
  );
}