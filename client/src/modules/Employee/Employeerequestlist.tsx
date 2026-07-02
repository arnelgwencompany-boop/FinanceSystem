import { useState, useEffect } from "react";
import { FileText } from "lucide-react";

import type { FilterStatus, Request } from "../../types/requestList";
import PageHeader         from "../../components/Employee/list/Pageheader";
import StatsBar           from "../../components/Employee/list/Statsbar";
import Toolbar            from "../../components/Employee/list/Toolbar";
import RequestCard        from "../../components/Employee/list/RequestCard";
import RequestDetailModal from "../../components/Employee/list/Requestdetailmodal";
import DeleteConfirmModal from "../../components/Employee/list/Deleteconfirmmodal";
import EditRequestModal    from "../../components/Employee/list/Editrequestmodal";
import { getRequests, deleteRequest } from "../../apis/employeeRequest";

// ─── Module-level helpers ─────────────────────────────────────────────────────
const capitalize = (text: string) =>
  text ? text.charAt(0).toUpperCase() + text.slice(1) : "";

function normalizeStatus(raw: string): Request["status"] {
  const lower = raw?.toLowerCase?.() ?? "";
  if (lower === "approved" || lower === "rejected" || lower === "pending") return lower;
  return "pending";
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function EmployeeRequestList() {
  // List state
  const [requests,  setRequests]  = useState<Request[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState<string | null>(null);
  const [filter,    setFilter]    = useState<FilterStatus>("all");
  const [query,     setQuery]     = useState("");
  const [expanded,  setExpanded]  = useState<Set<number>>(new Set());

  // Modal state
  const [viewReq,   setViewReq]   = useState<Request | null>(null);
  const [deleteReq, setDeleteReq] = useState<Request | null>(null);
  const [deleting,  setDeleting]  = useState(false);
  const [editReq,   setEditReq]   = useState<Request | null>(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    getRequests()
      .then((data: any[]) => {
        setRequests(
          data.map((r) => ({
            id:          r.id,
            request_no:  r.request_no,
            description: r.description,
            date:        r.date,
            amount:      r.amount,
            currency:    r.currency,
            department:  r.department ?? "",
            status:      normalizeStatus(r.status),
            approvals:   (r.approvals ?? []).map((a: any) => ({
              id:             a.id,
              role:           capitalize(a.role),
              status:         normalizeStatus(a.status),
              signed_by_name: a.signed_by_name ?? null,
            })),
          }))
        );
      })
      .catch((err: unknown) => {
        console.error("Failed to load requests:", err);
        setError("Could not load requests. Please try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const toggle = (id: number) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  // Print: open the modal first so DocumentBody is rendered, then trigger print
  const handlePrint = (req: Request) => {
    setViewReq(req);
    // Small delay so the modal renders before the browser print dialog opens
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("request-detail-print"));
    }, 150);
  };

  const handleEdit  = (req: Request) => setEditReq(req);

  const handleSaved = (updated: Request) => {
    setRequests((prev) => prev.map((r) => r.id === updated.id ? updated : r));
    setEditReq(null);
  };

  // Delete: show confirm modal → call API on confirm → remove from list
  const handleDeleteConfirm = async (req: Request) => {
    setDeleting(true);
    try {
      await deleteRequest(String(req.id));
      setRequests((prev) => prev.filter((r) => r.id !== req.id));
      setDeleteReq(null);
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete request. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  // ── Derived list ───────────────────────────────────────────────────────────
  const visible = requests.filter((r) => {
    const matchFilter = filter === "all" || r.status === filter;
    const q           = query.toLowerCase();
    const matchQuery  =
      !q ||
      r.request_no.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q);
    return matchFilter && matchQuery;
  });

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#eef1f4]">
        <div className="flex flex-col items-center gap-3">
          <span className="h-8 w-8 animate-spin rounded-full border-4 border-[#00355f] border-t-transparent" />
          <p className="text-[14px] font-medium text-slate-500">Loading requests…</p>
        </div>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#eef1f4]">
        <div className="flex flex-col items-center gap-3 text-center">
          <FileText size={32} className="text-slate-300" />
          <p className="text-[14px] font-medium text-slate-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-xl bg-[#00355f] px-4 py-2 text-[13px] font-bold text-white hover:bg-[#0f4c81]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ── Main view ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#eef1f4]">
      <div className="mx-auto max-w-[1700px] space-y-6 px-6 py-10">

        <PageHeader />
        <StatsBar requests={requests} />
        <Toolbar query={query} onQuery={setQuery} filter={filter} onFilter={setFilter} />

        <div className="flex flex-col gap-3">
          {visible.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <FileText size={32} className="mb-3 text-slate-300" />
              <p className="text-[14px] font-medium text-slate-400">
                No requests match this filter.
              </p>
              <button
                type="button"
                onClick={() => { setFilter("all"); setQuery(""); }}
                className="mt-3 text-[13px] font-medium text-[#00355f] hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            visible.map((req) => (
              <RequestCard
                key={req.id}
                req={req}
                expanded={expanded.has(req.id)}
                onToggle={() => toggle(req.id)}
                onView={(r)   => setViewReq(r)}
                onPrint={(r)  => handlePrint(r)}
                onEdit={(r)   => handleEdit(r)}
                onDelete={(r) => setDeleteReq(r)}
              />
            ))
          )}
        </div>
      </div>

      {/* View / Print modal */}
      <RequestDetailModal
        req={viewReq}
        onClose={() => setViewReq(null)}
      />

      {/* Delete confirm modal */}
      <DeleteConfirmModal
        req={deleteReq}
        onClose={() => setDeleteReq(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleting}
      />

      {/* Edit modal */}
      <EditRequestModal
        req={editReq}
        onClose={() => setEditReq(null)}
        onSaved={handleSaved}
      />
    </div>
  );
}