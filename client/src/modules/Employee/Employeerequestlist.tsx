import { useState, useEffect } from "react";
import { FileText } from "lucide-react";

import type { FilterStatus, Request } from "../../types/requestList";
import PageHeader  from "../../components/Employee/list/Pageheader";
import StatsBar    from "../../components/Employee/list/Statsbar";
import Toolbar     from "../../components/Employee/list/Toolbar";
import RequestCard from "../../components/Employee/list/RequestCard";
import { getRequests } from "../../apis/employeeRequest";
import LoadingScreen from "../../components/ui/LoadingScreen";
import RetryScreen   from "../../components/ui/RetryScreen";

// ─── Helpers defined at module level (never inside component) ─────────────────
const capitalize = (text: string) =>
  text ? text.charAt(0).toUpperCase() + text.slice(1) : "";

/** Coerce any casing the API returns into the union the UI expects. */
function normalizeStatus(raw: string): Request["status"] {
  const lower = raw?.toLowerCase?.() ?? "";
  if (lower === "approved" || lower === "rejected" || lower === "pending") return lower;
  return "pending"; // safe fallback
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function EmployeeRequestList() {
  const [filter,   setFilter]   = useState<FilterStatus>("all");
  const [query,    setQuery]    = useState("");
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);

  useEffect(() => {
    getRequests()
      .then((data: any[]) => {
        const formatted: Request[] = data.map((r) => ({
          id:          r.id,
          request_no:  r.request_no,
          description: r.description,
          date:        r.date,
          amount:      r.amount,
          currency:    r.currency,
          department:  r.department ?? "",
          // Normalize here — source of truth before any component sees it
          status: normalizeStatus(r.status),
          approvals: (r.approvals ?? []).map((a: any) => ({
            id:             a.id,
            role:           capitalize(a.role),
            status:         normalizeStatus(a.status),
            signed_by_name: a.signed_by_name ?? null,
          })),
        }));
        setRequests(formatted);
      })
      .catch((err: unknown) => {
        console.error("Failed to load requests:", err);
        setError("Could not load requests. Please try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  const toggle = (id: number) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const visible = requests.filter((r) => {
    const matchFilter = filter === "all" || r.status === filter;
    const q           = query.toLowerCase();
    const matchQuery  =
      !q ||
      r.request_no.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q);
    return matchFilter && matchQuery;
  });

  // ── Loading state ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <LoadingScreen message="Loading requests…" />
    );
  }

  // ── Error state ──────────────────────────────────────────────────────────
  if (error) {
    return (
      <RetryScreen
        title="Failed to Load Requests"
        message={error}
        onRetry={() => {
          setLoading(true);
          setError(null);
        }}
      />
    );
  }

  // ── Main view ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#eef1f4]">
      <div className="mx-auto max-w-[1700px] space-y-6 px-6 py-10">

        <PageHeader />

        <StatsBar requests={requests} />

        <Toolbar
          query={query}   onQuery={setQuery}
          filter={filter} onFilter={setFilter}
        />

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
              />
            ))
          )}
        </div>

      </div>
    </div>
  );
}