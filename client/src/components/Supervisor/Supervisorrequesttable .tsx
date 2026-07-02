import {
  CheckCircle2, XCircle, Eye,
  ChevronLeft, ChevronRight, Loader2, Inbox,
} from "lucide-react";
import {
  statusMeta, priorityMeta, fmt, PAGE_SIZE,
  type Request,
} from "../../components/approvedshared/Approvalshared";

interface Props {
  loading: boolean;
  paginated: Request[];
  filtered: Request[];
  page: number;
  onPageChange: (p: number) => void;
  acting: boolean;
  onView: (r: Request) => void;
  onApprove: (id: number) => void;
  onReject: (r: Request) => void;
  canAct: (status: string) => boolean;
}

const HEADERS = ["Request No.", "Requested By", "Dept.", "Amount", "Priority", "Date", "Status", "Actions"];

export default function SupervisorRequestTable({
  loading, paginated, filtered, page, onPageChange,
  acting, onView, onApprove, onReject, canAct,
}: Props) {
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center gap-3">
        <Loader2 size={32} className="text-[#00355f] animate-spin" />
        <p className="text-[15px] font-semibold text-slate-400">Loading requests…</p>
      </div>
    );
  }

  if (paginated.length === 0) {
    return (
      <div className="py-20 flex flex-col items-center gap-3">
        <Inbox size={36} className="text-slate-300" />
        <p className="text-[16px] font-bold text-slate-400">No requests found</p>
        <p className="text-[14px] text-slate-300">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100">
              {HEADERS.map((h) => (
                <th key={h} className="px-5 py-4 text-left text-[12px] font-bold uppercase tracking-widest text-slate-400">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {paginated.map((r) => {
              const sm  = statusMeta[r.status];
              const pm  = priorityMeta[r.priority];
              const act = canAct(r.status);
              return (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4">
                    <span className="text-[14px] font-bold text-[#00355f] font-mono">{r.requestNo}</span>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-[15px] font-bold text-[#1a2e3f]">{r.requestedBy}</p>
                    <p className="text-[12px] text-slate-400 mt-0.5 max-w-[160px] truncate">{r.description}</p>
                  </td>
                  <td className="px-5 py-4 text-[14px] font-semibold text-slate-600">{r.department}</td>
                  <td className="px-5 py-4 text-[15px] font-extrabold text-[#ba1a1a]">{fmt(r.amount)}</td>
                  <td className="px-5 py-4">
                    <span className={`text-[12px] font-bold px-2.5 py-1 rounded-full ${pm.bg} ${pm.text}`}>
                      {r.priority}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[13px] text-slate-500">{r.date}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-[12px] font-bold px-2.5 py-1.5 rounded-full ${sm.bg} ${sm.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${sm.dot}`} />
                      {sm.label}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onView(r)}
                        className="flex items-center gap-1.5 px-3 py-2 border-2 border-slate-200 text-[13px] font-bold text-[#00355f] rounded-xl hover:bg-slate-50 transition-colors"
                      >
                        <Eye size={14} /> View
                      </button>
                      {act && (
                        <>
                          <button
                            onClick={() => onApprove(r.id)}
                            disabled={acting}
                            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[13px] font-bold rounded-xl transition-colors disabled:opacity-60"
                          >
                            <CheckCircle2 size={14} /> Approve
                          </button>
                          <button
                            onClick={() => onReject(r)}
                            disabled={acting}
                            className="flex items-center gap-1.5 px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-[13px] font-bold rounded-xl transition-colors disabled:opacity-60"
                          >
                            <XCircle size={14} /> Reject
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filtered.length > PAGE_SIZE && (
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-[13px] text-slate-400">
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page === 1}
              className="w-9 h-9 flex items-center justify-center rounded-xl border-2 border-slate-200 text-slate-500 hover:border-[#00355f] disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`w-9 h-9 flex items-center justify-center rounded-xl border-2 text-[14px] font-bold transition-colors ${
                  p === page
                    ? "bg-[#00355f] border-[#00355f] text-white"
                    : "border-slate-200 text-slate-500 hover:border-[#00355f]"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="w-9 h-9 flex items-center justify-center rounded-xl border-2 border-slate-200 text-slate-500 hover:border-[#00355f] disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}