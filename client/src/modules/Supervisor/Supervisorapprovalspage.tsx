import { useState, useEffect } from "react";
import {
  MOCK_REQUESTS, ToastContainer, DetailModal, RejectModal, useToast,
  type Request, type FilterTab,
} from "../../components/approvedshared/Approvalshared";
import { PAGE_SIZE } from "../../components/approvedshared/Approvalshared";

import SupervisorHeader       from "../../components/Supervisor/Supervisorheader";
import SupervisorSummaryCards from "../../components/Supervisor/Supervisorsummarycards";
import SupervisorFilterBar    from "../../components/Supervisor/Supervisorfilterbar";
import SupervisorRequestTable from "../../components/Supervisor/Supervisorrequesttable ";

const ROLE = "supervisor" as const;
const canAct = (status: string) => status === "Pending";

export default function SupervisorApprovalsPage() {
  const [requests,    setRequests]    = useState<Request[]>(MOCK_REQUESTS);
  const [search,      setSearch]      = useState("");
  const [activeTab,   setActiveTab]   = useState<FilterTab>("All");
  const [page,        setPage]        = useState(1);
  const [detailReq,   setDetailReq]   = useState<Request | null>(null);
  const [rejectReq,   setRejectReq]   = useState<Request | null>(null);
  const [acting,      setActing]      = useState(false);
  const [loading,     setLoading]     = useState(true);
  const { toasts, add: addToast, dismiss } = useToast();

  useEffect(() => { setTimeout(() => setLoading(false), 900); }, []);

  // ── Actions ────────────────────────────────────────────────────────────────
  const handleApprove = (id: number) => {
    setActing(true);
    setTimeout(() => {
      setRequests((p) =>
        p.map((r) => r.id === id ? { ...r, status: "Supervisor Approved" as const } : r)
      );
      addToast("success", "Request approved and forwarded to the Director for final review.");
      setActing(false);
    }, 700);
  };

  const handleReject = (id: number, reason: string) => {
    setActing(true);
    setTimeout(() => {
      setRequests((p) =>
        p.map((r) => r.id === id ? { ...r, status: "Rejected" as const, notes: reason } : r)
      );
      addToast("error", "Request has been rejected.");
      setRejectReq(null);
      setActing(false);
    }, 600);
  };

  const filtered = requests.filter((r) => {
    const q = search.toLowerCase();
    return (
      (r.requestNo.toLowerCase().includes(q) || r.requestedBy.toLowerCase().includes(q)) &&
      (activeTab === "All" || r.status === activeTab)
    );
  });

  const counts = {
    All:                  requests.length,
    Pending:              requests.filter((r) => r.status === "Pending").length,
    "Supervisor Approved":requests.filter((r) => r.status === "Supervisor Approved").length,
    "Fully Approved":     requests.filter((r) => r.status === "Fully Approved").length,
    Rejected:             requests.filter((r) => r.status === "Rejected").length,
  };

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleTabChange = (tab: FilterTab) => { setActiveTab(tab); setPage(1); };

  return (
    <main className="mt-5 min-h-[calc(100vh-64px)] bg-[#f7f9fb] overflow-y-auto">
      <ToastContainer toasts={toasts} dismiss={dismiss} />

      <div className="px-8 py-8 max-w-[1700px] mx-auto space-y-6">

        {/* Header + notice */}
        <SupervisorHeader pendingCount={counts.Pending} />

        {/* Summary cards */}
        <SupervisorSummaryCards
          counts={counts}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        {/* Table card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

          {/* Search, filters, tabs */}
          <SupervisorFilterBar
            search={search}
            onSearchChange={(v) => { setSearch(v); setPage(1); }}
            onTabChange={handleTabChange}
            counts={counts}
          />

          {/* Table + pagination */}
          <SupervisorRequestTable
            loading={loading}
            paginated={paginated}
            filtered={filtered}
            page={page}
            onPageChange={setPage}
            acting={acting}
            onView={(r) => setDetailReq(r)}
            onApprove={handleApprove}
            onReject={(r) => setRejectReq(r)}
            canAct={canAct}
          />
        </div>
      </div>

      {/* Modals */}
      {detailReq && (
        <DetailModal
          req={detailReq}
          role={ROLE}
          onClose={() => setDetailReq(null)}
          onApprove={(id) => { handleApprove(id); setDetailReq(null); }}
          onReject={(id) => {
            setRejectReq(requests.find((r) => r.id === id) || null);
            setDetailReq(null);
          }}
          acting={acting}
          canAct={canAct(detailReq.status)}
        />
      )}
      {rejectReq && (
        <RejectModal
          reqNo={rejectReq.requestNo}
          onConfirm={(reason) => handleReject(rejectReq.id, reason)}
          onClose={() => setRejectReq(null)}
        />
      )}
    </main>
  );
}