import { useState } from "react";
import { FileText } from "lucide-react";

import type { FilterStatus, Request } from "../../types/requestList";
import PageHeader      from "../../components/Employee/list/Pageheader";
import StatsBar        from "../../components/Employee/list/Statsbar";
import Toolbar         from "../../components/Employee/list/Toolbar";
import RequestCard     from "../../components/Employee/list/RequestCard";

// ─── Mock data — replace with GET /api/requests/ ─────────────────────────────
const REQUESTS: Request[] = [
  {
    id: 1,
    request_no: "REQ-00001",
    description: "Purchase of new laptop for development team",
    date: "2026-06-25",
    amount: "75000.00",
    currency: "PHP",
    department: "IT Ops",
    status: "approved",
    approvals: [
      { id: 1,  role: "Supervisor", status: "approved", signed_by_name: "Maria Santos"  },
      { id: 2,  role: "Director",   status: "approved", signed_by_name: "Eduardo Reyes" },
      { id: 3,  role: "Finance",    status: "approved", signed_by_name: "Ana Flores"    },
      { id: 4,  role: "Admin",      status: "pending",  signed_by_name: null            },
    ],
  },
  {
    id: 2,
    request_no: "REQ-00002",
    description: "Office supplies restock — Q3 stationery and printing materials",
    date: "2026-06-20",
    amount: "12500.00",
    currency: "PHP",
    department: "Admin",
    status: "pending",
    approvals: [
      { id: 5,  role: "Supervisor", status: "approved", signed_by_name: "Maria Santos" },
      { id: 6,  role: "Director",   status: "pending",  signed_by_name: null           },
      { id: 7,  role: "Finance",    status: "pending",  signed_by_name: null           },
      { id: 8,  role: "Admin",      status: "pending",  signed_by_name: null           },
    ],
  },
  {
    id: 3,
    request_no: "REQ-00003",
    description: "Team offsite transportation and accommodation — Tagaytay sprint",
    date: "2026-06-10",
    amount: "38200.00",
    currency: "PHP",
    department: "IT Ops",
    status: "rejected",
    approvals: [
      { id: 9,  role: "Supervisor", status: "approved",  signed_by_name: "Maria Santos"  },
      { id: 10, role: "Director",   status: "rejected",  signed_by_name: "Eduardo Reyes" },
      { id: 11, role: "Finance",    status: "pending",   signed_by_name: null            },
      { id: 12, role: "Admin",      status: "pending",   signed_by_name: null            },
    ],
  },
  {
    id: 4,
    request_no: "REQ-00004",
    description: "Software license renewal — Figma and Notion annual plan",
    date: "2026-05-28",
    amount: "29000.00",
    currency: "PHP",
    department: "IT Ops",
    status: "approved",
    approvals: [
      { id: 13, role: "Supervisor", status: "approved", signed_by_name: "Maria Santos"  },
      { id: 14, role: "Director",   status: "approved", signed_by_name: "Eduardo Reyes" },
      { id: 15, role: "Finance",    status: "approved", signed_by_name: "Ana Flores"    },
      { id: 16, role: "Admin",      status: "approved", signed_by_name: "Carlo Mendoza" },
    ],
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function EmployeeRequestList() {
  const [filter,   setFilter]   = useState<FilterStatus>("all");
  const [query,    setQuery]    = useState("");
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const toggle = (id: number) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const visible = REQUESTS.filter((r) => {
    const matchFilter = filter === "all" || r.status === filter;
    const q           = query.toLowerCase();
    const matchQuery  =
      !q ||
      r.request_no.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q);
    return matchFilter && matchQuery;
  });

  return (
    <div className="min-h-screen bg-[#eef1f4]">
      <div className="mx-auto max-w-[1700px] space-y-6 px-6 py-10">

        {/* Header */}
        <PageHeader />

        {/* Stats */}
        <StatsBar requests={REQUESTS} />

        {/* Search + filters + new-request button */}
        <Toolbar
          query={query}    onQuery={setQuery}
          filter={filter}  onFilter={setFilter}
        />

        {/* Card list */}
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