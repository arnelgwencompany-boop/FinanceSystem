import { useState, useRef } from "react";
import type { PettyCashRequest, PaymentRequestForm } from "../../types/requests";
import { EMPTY_FORM } from "../../types/requests";
import RequestHeader from "../../components/requests/Requestheader";
import RequestSelector from "../../components/requests/Requestselector";
import PrintableForm from "../../components/requests/Printableform";
import { ALL_REQUESTS } from "../../data/requestData";


// ─────────────────────────────────────────────────────────────────────────────

export default function RequestPage() {
  const [requests, setRequests] = useState<PettyCashRequest[]>(ALL_REQUESTS);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [form] = useState<PaymentRequestForm>(EMPTY_FORM);
  const printRef = useRef<HTMLDivElement>(null!);

  const selectedRequests = requests.filter((r) => selectedIds.has(r.id));

  const handleToggle = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSelectAll = (visible: PettyCashRequest[]) => {
    setSelectedIds(new Set(visible.map((r) => r.id)));
  };

  const handleClearAll = () => setSelectedIds(new Set());

  // ── Approval actions ──────────────────────────────────────────────────────
  const handleApprove = (ids: Set<number>) => {
    setRequests((prev) =>
      prev.map((r) => (ids.has(r.id) ? { ...r, status: "Approved" } : r))
    );
    setSelectedIds(new Set());
  };

  const handleReject = (ids: Set<number>) => {
    setRequests((prev) =>
      prev.map((r) => (ids.has(r.id) ? { ...r, status: "Rejected" } : r))
    );
    setSelectedIds(new Set());
  };

  const handleApproveSingle = (id: number) => handleApprove(new Set([id]));
  const handleRejectSingle = (id: number) => handleReject(new Set([id]));

  // ── Print ─────────────────────────────────────────────────────────────────
  const handlePrint = () => {
    if (!printRef.current) return;
    const printContents = printRef.current.innerHTML;
    const win = window.open("", "_blank", "width=900,height=700");
    if (!win) return;
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Payment Request Form</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: Arial, sans-serif; font-size: 12px; color: #191c1e; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 0; }
            td, th { border: 1px solid #191c1e; padding: 4px 8px; }
            th { background: #f2f4f6; font-weight: bold; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            .font-bold { font-weight: bold; }
            @media print { body { padding: 10px; } @page { margin: 1cm; } }
          </style>
        </head>
        <body>${printContents}</body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 400);
  };

  return (
    <main className="ml-[240px] mt-16 p-8 min-h-[calc(100vh-64px)] bg-[#f7f9fb]">
      <div className="max-w-[1740px] mx-auto space-y-6">

        <RequestHeader onPrint={handlePrint} />

        <div className="grid grid-cols-12 gap-6 items-start">

          {/* LEFT — request list + actions */}
          <div className="col-span-12 xl:col-span-5 space-y-5">
            <RequestSelector
              requests={requests}
              selectedIds={selectedIds}
              onToggle={handleToggle}
              onSelectAll={handleSelectAll}
              onClearAll={handleClearAll}
              onApproveSingle={handleApproveSingle}
              onRejectSingle={handleRejectSingle}
              onApproveSelected={() => handleApprove(selectedIds)}
              onRejectSelected={() => handleReject(selectedIds)}
            />
          </div>

          {/* RIGHT — printable preview */}
          <div className="col-span-12 xl:col-span-7">
            <PrintableForm
              transactions={selectedRequests.map((r) => ({
                id: r.id,
                department: r.department,
                unit: "1",
                item: String(r.id),
                date: r.date,
                description: r.description,
                payOut: r.amount,
                VAT: r.VAT,
                withoutVAT: r.withoutVAT,
                deliveryFee: r.deliveryFee,
                balance: 0,
                status: r.status,
              }))}
              form={form}
              printRef={printRef}
            />
          </div>

        </div>
      </div>
    </main>
  );
}