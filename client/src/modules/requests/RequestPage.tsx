import { useState, useRef } from "react";
import {  EMPTY_FORM } from "../../types/requests";
import type { Transaction, PaymentRequestForm, } from "../../types/requests";
import RequestHeader from "../../components/requests/Requestheader";
import TransactionSelector from "../../components/requests/Transactionselector";
import RequestDetailsForm from "../../components/requests/Requestdetailsform";
import FormSummaryBar from "../../components/requests/Formsummurybar";
import PrintableForm from "../../components/requests/Printableform";

// ─── Mock data (replace with real data from context/store/props) ─────────────
const ALL_TRANSACTIONS: Transaction[] = [
  {
    id: 1, department: "GA", unit: "0", item: "1", date: "2026-01-25",
    description: "Headphone set (500 pcs)", payOut: 3000.9, VAT: 252.4,
    withoutVAT: 2102.5, deliveryFee: 394, balance: 97000.1, status: "Completed",
  },
  {
    id: 2, department: "GO", unit: "0", item: "2", date: "2026-01-11",
    description: "Humidity Temperature sensor", payOut: 2000.5, VAT: 0,
    withoutVAT: 178, deliveryFee: 58.5, balance: 95000.6, status: "Completed",
  },
  {
    id: 3, department: "IT Ops", unit: "5", item: "3", date: "2026-02-03",
    description: "Network Switch (24-port)", payOut: 8500, VAT: 1020,
    withoutVAT: 7480, deliveryFee: 250, balance: 86500.6, status: "Completed",
  },
  {
    id: 4, department: "IT Ops", unit: "2", item: "4", date: "2026-02-15",
    description: "UPS Battery Backup", payOut: 4200, VAT: 504,
    withoutVAT: 3696, deliveryFee: 0, balance: 82300.6, status: "Pending",
  },
  {
    id: 5, department: "Marketing", unit: "1", item: "5", date: "2026-03-01",
    description: "Printer cartridges (bulk)", payOut: 1500, VAT: 180,
    withoutVAT: 1320, deliveryFee: 120, balance: 80800.6, status: "Completed",
  },
];
// ─────────────────────────────────────────────────────────────────────────────

export default function RequestPage() {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [form, setForm] = useState<PaymentRequestForm>(EMPTY_FORM);
  const printRef = useRef<HTMLDivElement>(null!);

  const selectedTransactions = ALL_TRANSACTIONS.filter((t) => selectedIds.has(t.id));

  const handleToggle = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    setSelectedIds(new Set(ALL_TRANSACTIONS.map((t) => t.id)));
  };

  const handleClearAll = () => setSelectedIds(new Set());

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
            .font-mono { font-family: monospace; }
            @media print {
              body { padding: 10px; }
              @page { margin: 1cm; }
            }
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

        <FormSummaryBar
          transactions={selectedTransactions}
          withheldAmount={form.withheldAmount}
        />

        <div className="grid grid-cols-12 gap-6 items-start">

          {/* LEFT — selector + request details */}
          <div className="col-span-12 xl:col-span-4 space-y-5">
            <TransactionSelector
              transactions={ALL_TRANSACTIONS}
              selectedIds={selectedIds}
              onToggle={handleToggle}
              onSelectAll={handleSelectAll}
              onClearAll={handleClearAll}
            />
            {/* <RequestDetailsForm form={form} onChange={setForm} /> */}
          </div>

          {/* RIGHT — printable preview */}
          <div className="col-span-12 xl:col-span-8">
            <PrintableForm
              transactions={selectedTransactions}
              form={form}
              printRef={printRef}
            />
          </div>

        </div>
      </div>
    </main>
  );
}