import { useRef } from "react";
import { X, Printer } from "lucide-react";
import type { Request } from "../../../types/requestList";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const sym = (currency: string) =>
  currency === "PHP" ? "₱" : currency === "USD" ? "$" : `${currency} `;

const money = (val: string | number | undefined) =>
  parseFloat(String(val || 0)).toLocaleString("en-PH", { minimumFractionDigits: 2 });

// ─── Document body — matches the printed form layout ─────────────────────────
function DocumentBody({ req }: { req: Request }) {
  const s     = sym(req.currency);
  const total = parseFloat(req.amount || "0");

  const cell = (content: React.ReactNode, opts?: { header?: boolean; width?: string }) => ({
    style: {
      border: "1px solid #94a3b8",
      padding: "5px 8px",
      ...(opts?.header ? { background: "#f2f4f6", fontWeight: "bold" as const, fontSize: "10px", textTransform: "uppercase" as const, letterSpacing: "0.04em", color: "#64748b" } : {}),
      ...(opts?.width ? { width: opts.width } : {}),
    },
    children: content,
  });

  return (
    <div style={{ fontFamily: "Arial, sans-serif", fontSize: "12px", color: "#191c1e" }}>
      {/* Letterhead */}
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <p style={{ fontWeight: "bold", fontSize: "15px" }}>Company Name</p>
        <p style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>Payment Request Form</p>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
        <span style={{ fontSize: "11px" }}>Date: <strong>{req.date || "—"}</strong></span>
      </div>

      {/* Identity row */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "8px" }}>
        <thead>
          <tr>
            {["Request No.", "Department", "Date", "Status"].map((h) => (
              <th key={h} {...cell(h, { header: true })} />
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td {...cell(<span style={{ fontFamily: "monospace" }}>{req.request_no}</span>)} />
            <td {...cell(req.department || "—")} />
            <td {...cell(req.date || "—")} />
            <td {...cell(req.status.charAt(0).toUpperCase() + req.status.slice(1))} />
          </tr>
        </tbody>
      </table>

      {/* Description */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "8px" }}>
        <tbody>
          <tr>
            <td {...cell("Description", { header: true, width: "110px" })} />
            <td {...cell(req.description || "—")} />
          </tr>
        </tbody>
      </table>

      {/* Financial */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "8px" }}>
        <tbody>
          <tr>
            <td {...cell(<><strong>Currency: </strong>{req.currency}</>, { header: false, width: "50%" })} />
            <td {...cell(<><strong>Total Amount: </strong>{s}{money(total)}</>)} />
          </tr>
        </tbody>
      </table>

      {/* Approval pipeline */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "8px" }}>
        <thead>
          <tr>
            <th colSpan={4} {...cell("Approval Process: Applicant → Supervisor → Director → FA", { header: true })} />
          </tr>
          <tr>
            {["Applicant", "Supervisor", "Director", "Approval (FA)"].map((h) => (
              <th key={h} {...cell(h, { header: true })} />
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {req.approvals.map((a) => (
              <td
                key={a.id}
                style={{ border: "1px solid #94a3b8", height: "48px", padding: "4px 8px", verticalAlign: "top" }}
              >
                {a.signed_by_name ? (
                  <div>
                    <p style={{ fontSize: "11px", fontWeight: "bold", color: "#1a2e3f" }}>{a.signed_by_name}</p>
                    <p style={{ fontSize: "10px", color: a.status === "approved" ? "#059669" : a.status === "rejected" ? "#dc2626" : "#d97706", marginTop: "2px" }}>
                      {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                    </p>
                  </div>
                ) : (
                  <p style={{ fontSize: "10px", color: "#cbd5e1" }}>Pending</p>
                )}
              </td>
            ))}
          </tr>
        </tbody>
      </table>

      {/* Note */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            <td {...cell("Note", { header: true, width: "60px" })} />
            <td {...cell(<span style={{ color: "#94a3b8" }}>If there is any withholding payment, please specify.</span>)} />
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
interface Props {
  req:     Request | null;
  onClose: () => void;
}

export default function RequestDetailModal({ req, onClose }: Props) {
  const printRef = useRef<HTMLDivElement>(null);

  if (!req) return null;

  const handlePrint = () => {
    const content = printRef.current?.innerHTML;
    if (!content) return;
    const win = window.open("", "_blank", "width=900,height=700");
    if (!win) return;
    win.document.write(`
      <!DOCTYPE html><html><head>
        <title>${req.request_no} — Payment Request</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 32px; margin: 0; }
          table { border-collapse: collapse; width: 100%; }
          @page { margin: 18mm; }
        </style>
      </head><body>${content}</body></html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 300);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="flex w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* Modal header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-[#00355f] px-6 py-4">
          <div>
            <p className="font-mono text-[12px] font-medium text-white/60">{req.request_no}</p>
            <h2 className="text-[17px] font-extrabold text-white">Payment Request — Full View</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-xl bg-white/15 px-4 py-2 text-[13px] font-bold text-white transition-colors hover:bg-white/25"
            >
              <Printer size={14} /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-white/60 transition-colors hover:bg-white/15 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Document body — scrollable */}
        <div className="overflow-auto p-6" style={{ maxHeight: "75vh" }}>
          {/* Hidden ref for print */}
          <div className="hidden" ref={printRef}><DocumentBody req={req} /></div>
          {/* Visible */}
          <DocumentBody req={req} />
        </div>

      </div>
    </div>
  );
}