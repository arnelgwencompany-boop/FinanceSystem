import { useState, useEffect } from "react";
import {
  CheckCircle2, XCircle, Eye, Search, Filter,
  ChevronDown, Clock, CheckCheck, FileText,
  ChevronLeft, ChevronRight, Loader2, Inbox,
} from "lucide-react";
import {
  MOCK_REQUESTS, statusMeta, priorityMeta, fmt, PAGE_SIZE,
  ToastContainer, DetailModal, RejectModal, SummaryCard, useToast,
  type Request, type FilterTab,
} from "../../components/approvedshared/Approvalshared";

const ROLE = "supervisor" as const;
const USER = { name: "Maria Santos", initials: "MS" };

// Supervisor acts on: Pending only
const canAct = (status: string) => status === "Pending";

export default function SupervisorApprovalsPage() {
  const [requests,    setRequests]    = useState<Request[]>(MOCK_REQUESTS);
  const [search,      setSearch]      = useState("");
  const [activeTab,   setActiveTab]   = useState<FilterTab>("All");
  const [showFilters, setShowFilters] = useState(false);
  const [deptFilter,  setDeptFilter]  = useState("All");
  const [priFilter,   setPriFilter]   = useState("All");
  const [page,        setPage]        = useState(1);
  const [detailReq,   setDetailReq]   = useState<Request | null>(null);
  const [rejectReq,   setRejectReq]   = useState<Request | null>(null);
  const [acting,      setActing]      = useState(false);
  const [loading,     setLoading]     = useState(true);
  const { toasts, add: addToast, dismiss } = useToast();

  useEffect(() => { setTimeout(() => setLoading(false), 900); }, []);

  const handleApprove = (id: number) => {
    setActing(true);
    setTimeout(() => {
      setRequests((p) => p.map((r) => r.id === id ? { ...r, status: "Supervisor Approved" as const } : r));
      addToast("success", "Request approved and forwarded to the Director for final review.");
      setActing(false);
    }, 700);
  };

  const handleReject = (id: number, reason: string) => {
    setActing(true);
    setTimeout(() => {
      setRequests((p) => p.map((r) => r.id === id ? { ...r, status: "Rejected" as const, notes: reason } : r));
      addToast("error", "Request has been rejected.");
      setRejectReq(null);
      setActing(false);
    }, 600);
  };

  const departments = ["All", ...Array.from(new Set(requests.map((r) => r.department)))];

  const filtered = requests.filter((r) => {
    const q = search.toLowerCase();
    return (
      (r.requestNo.toLowerCase().includes(q) || r.requestedBy.toLowerCase().includes(q)) &&
      (activeTab === "All" || r.status === activeTab) &&
      (deptFilter === "All" || r.department === deptFilter) &&
      (priFilter  === "All" || r.priority   === priFilter)
    );
  });

  const counts = {
    All:                requests.length,
    Pending:            requests.filter((r) => r.status === "Pending").length,
    "Supervisor Approved": requests.filter((r) => r.status === "Supervisor Approved").length,
    "Fully Approved":   requests.filter((r) => r.status === "Fully Approved").length,
    Rejected:           requests.filter((r) => r.status === "Rejected").length,
  };

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const TABS: FilterTab[] = ["All", "Pending", "Supervisor Approved", "Fully Approved", "Rejected"];

  const tabColor = (tab: FilterTab) =>
    tab === "Pending" ? "bg-amber-100 text-amber-700" :
    tab === "Supervisor Approved" ? "bg-blue-100 text-blue-700" :
    tab === "Fully Approved" ? "bg-emerald-100 text-emerald-700" :
    tab === "Rejected" ? "bg-red-100 text-red-600" : "bg-slate-100 text-slate-600";

  return (
    <main className="ml-[270px] mt-16 min-h-[calc(100vh-64px)] bg-[#f7f9fb] overflow-y-auto">
      <ToastContainer toasts={toasts} dismiss={dismiss} />

      <div className="px-8 py-8 max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)" }}>
              <CheckCheck size={22} color="white" />
            </div>
            <div>
              <h1 className="text-[24px] font-extrabold text-[#00355f] leading-tight">
                Supervisor Approval Dashboard
              </h1>
              <p className="text-[15px] text-slate-500 mt-0.5">
                Review pending requests and forward approved ones to the Director.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border-2 border-purple-200 bg-purple-50">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[13px] font-extrabold text-white"
              style={{ background: "linear-gradient(135deg,#7c3aed,#6d28d9)" }}>
              {USER.initials}
            </div>
            <div>
              <p className="text-[14px] font-bold text-[#00355f]">{USER.name}</p>
              <p className="text-[12px] text-purple-500 font-semibold">Supervisor</p>
            </div>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <SummaryCard label="Total"          count={counts.All}                    active={activeTab === "All"}                 onClick={() => { setActiveTab("All");                 setPage(1); }} icon={<FileText size={20} className="text-[#00355f]" />}      color="bg-slate-100"  />
          <SummaryCard label="Pending"        count={counts.Pending}                active={activeTab === "Pending"}             onClick={() => { setActiveTab("Pending");             setPage(1); }} icon={<Clock size={20} className="text-amber-600" />}          color="bg-amber-50"   />
          <SummaryCard label="Fwd to Director"count={counts["Supervisor Approved"]} active={activeTab === "Supervisor Approved"} onClick={() => { setActiveTab("Supervisor Approved"); setPage(1); }} icon={<CheckCircle2 size={20} className="text-blue-600" />}    color="bg-blue-50"    />
          <SummaryCard label="Rejected"       count={counts.Rejected}               active={activeTab === "Rejected"}            onClick={() => { setActiveTab("Rejected");            setPage(1); }} icon={<XCircle size={20} className="text-red-500" />}          color="bg-red-50"     />
        </div>

        {/* Actionable notice */}
        {counts.Pending > 0 && (
          <div className="flex items-center gap-3 px-5 py-3.5 rounded-xl border border-amber-200 bg-amber-50">
            <Clock size={18} className="text-amber-600 flex-shrink-0" />
            <p className="text-[15px] font-semibold text-amber-800">
              You have <span className="font-extrabold">{counts.Pending}</span> pending request{counts.Pending > 1 ? "s" : ""} awaiting your approval.
            </p>
          </div>
        )}

        {/* Table card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          {/* Search + filter */}
          <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search by name or request number…"
                className="w-full pl-10 pr-4 py-2.5 border-2 border-slate-200 rounded-xl text-[15px] text-[#1a2e3f] outline-none focus:border-[#00355f] focus:ring-4 focus:ring-[#00355f]/10 transition-all" />
            </div>
            <button onClick={() => setShowFilters((v) => !v)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-[14px] font-bold transition-all ${
                showFilters ? "bg-[#00355f] text-white border-[#00355f]" : "bg-white text-slate-600 border-slate-200 hover:border-[#00355f]/40"
              }`}>
              <Filter size={15} /> Filters
              <ChevronDown size={14} className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </button>
          </div>

          {showFilters && (
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex flex-wrap gap-4">
              {[
                { label: "Department", value: deptFilter, options: departments,                  onChange: (v: string) => { setDeptFilter(v); setPage(1); } },
                { label: "Priority",   value: priFilter,  options: ["All","Low","Medium","High"], onChange: (v: string) => { setPriFilter(v);  setPage(1); } },
              ].map(({ label, value, options, onChange }) => (
                <div key={label} className="flex flex-col gap-1">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
                  <select value={value} onChange={(e) => onChange(e.target.value)}
                    className="border-2 border-slate-200 rounded-xl px-3 py-2 text-[14px] text-[#1a2e3f] outline-none focus:border-[#00355f]">
                    {options.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              <div className="flex items-end">
                <button onClick={() => { setDeptFilter("All"); setPriFilter("All"); setSearch(""); setPage(1); }}
                  className="px-4 py-2 text-[13px] font-bold text-red-500 border-2 border-red-200 rounded-xl hover:bg-red-50 transition-colors">
                  Clear
                </button>
              </div>
            </div>
          )}

          {/* Status tabs */}
          <div className="flex border-b border-slate-100 overflow-x-auto">
            {TABS.map((tab) => (
              <button key={tab} onClick={() => { setActiveTab(tab); setPage(1); }}
                className={`px-5 py-3.5 text-[14px] font-bold whitespace-nowrap relative transition-colors flex-shrink-0 ${
                  activeTab === tab ? "text-[#00355f]" : "text-slate-400 hover:text-[#00355f]"
                }`}>
                {tab === "Supervisor Approved" ? "Forwarded" : tab}
                {counts[tab as keyof typeof counts] > 0 && (
                  <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${tabColor(tab)}`}>
                    {counts[tab as keyof typeof counts]}
                  </span>
                )}
                {activeTab === tab && <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#00355f] rounded-t" />}
              </button>
            ))}
          </div>

          {/* Table body */}
          {loading ? (
            <div className="py-20 flex flex-col items-center gap-3">
              <Loader2 size={32} className="text-[#00355f] animate-spin" />
              <p className="text-[15px] font-semibold text-slate-400">Loading requests…</p>
            </div>
          ) : paginated.length === 0 ? (
            <div className="py-20 flex flex-col items-center gap-3">
              <Inbox size={36} className="text-slate-300" />
              <p className="text-[16px] font-bold text-slate-400">No requests found</p>
              <p className="text-[14px] text-slate-300">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    {["Request No.", "Requested By", "Dept.", "Amount", "Priority", "Date", "Status", "Actions"].map((h) => (
                      <th key={h} className="px-5 py-4 text-left text-[12px] font-bold uppercase tracking-widest text-slate-400">{h}</th>
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
                          <span className={`text-[12px] font-bold px-2.5 py-1 rounded-full ${pm.bg} ${pm.text}`}>{r.priority}</span>
                        </td>
                        <td className="px-5 py-4 text-[13px] text-slate-500">{r.date}</td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 text-[12px] font-bold px-2.5 py-1.5 rounded-full ${sm.bg} ${sm.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${sm.dot}`} />{sm.label}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button onClick={() => setDetailReq(r)}
                              className="flex items-center gap-1.5 px-3 py-2 border-2 border-slate-200 text-[13px] font-bold text-[#00355f] rounded-xl hover:bg-slate-50 transition-colors">
                              <Eye size={14} /> View
                            </button>
                            {act && (
                              <>
                                <button onClick={() => handleApprove(r.id)} disabled={acting}
                                  className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[13px] font-bold rounded-xl transition-colors disabled:opacity-60">
                                  <CheckCircle2 size={14} /> Approve
                                </button>
                                <button onClick={() => setRejectReq(r)} disabled={acting}
                                  className="flex items-center gap-1.5 px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-[13px] font-bold rounded-xl transition-colors disabled:opacity-60">
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
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => setPage(p)}
                    className={`w-9 h-9 flex items-center justify-center rounded-xl border-2 text-[14px] font-bold transition-colors ${
                      p === page ? "bg-[#00355f] border-[#00355f] text-white" : "border-slate-200 text-slate-500 hover:border-[#00355f]"
                    }`}>{p}</button>
                ))}
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="w-9 h-9 flex items-center justify-center rounded-xl border-2 border-slate-200 text-slate-500 hover:border-[#00355f] disabled:opacity-40">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {detailReq && (
        <DetailModal req={detailReq} role={ROLE} onClose={() => setDetailReq(null)}
          onApprove={(id) => { handleApprove(id); setDetailReq(null); }}
          onReject={(id) => { setRejectReq(requests.find((r) => r.id === id) || null); setDetailReq(null); }}
          acting={acting} canAct={canAct(detailReq.status)} />
      )}
      {rejectReq && (
        <RejectModal reqNo={rejectReq.requestNo}
          onConfirm={(reason) => handleReject(rejectReq.id, reason)}
          onClose={() => setRejectReq(null)} />
      )}
    </main>
  );
}