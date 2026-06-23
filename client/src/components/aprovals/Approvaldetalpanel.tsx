import { X, Check, XCircle, Printer, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import type { ApprovalTransaction, ApprovalStatus } from "../../types/approvals";

type Props = {
  transaction: ApprovalTransaction | null;
  onClose: () => void;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  onRemarksChange: (id: number, remarks: string) => void;
};

function fmt(n: number) {
  return n.toLocaleString("en-PH", { minimumFractionDigits: 2 });
}

const STATUS_CONFIG: Record<ApprovalStatus, { icon: React.ReactNode; bg: string; text: string; border: string }> = {
  Pending:  { icon: <Clock size={14} />,        bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200" },
  Approved: { icon: <CheckCircle2 size={14} />, bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  Rejected: { icon: <AlertCircle size={14} />,  bg: "bg-red-50",     text: "text-[#ba1a1a]",   border: "border-red-200" },
};

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-bold uppercase tracking-widest text-[#727780]">{label}</span>
      <span className="text-[13px] text-[#1a2e3f] font-medium">{value || "—"}</span>
    </div>
  );
}

function Checkbox({ checked, label }: { checked: boolean; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 mr-4 text-[12px]">
      <span className={`w-4 h-4 border rounded flex items-center justify-center text-[9px] font-bold flex-shrink-0
        ${checked ? "bg-[#00355f] border-[#00355f] text-white" : "border-[#c2c7d1] bg-white"}`}>
        {checked ? "✓" : ""}
      </span>
      {label}
    </span>
  );
}

export default function ApprovalDetailPanel({
  transaction: t, onClose, onApprove, onReject, onRemarksChange,
}: Props) {
  if (!t) {
    return (
      <div className="bg-white border border-[#c2c7d1] rounded-2xl shadow-sm flex flex-col items-center justify-center py-20 text-center h-full min-h-[400px]">
        <div className="text-5xl mb-4">📋</div>
        <p className="text-[14px] font-semibold text-[#505f76]">Select a request to review</p>
        <p className="text-[12px] text-[#a0a8b3] mt-1">Click any row in the table to see the full payment request form.</p>
      </div>
    );
  }

  const net = t.payOut - (t.withheldAmount || 0);
  const sc = STATUS_CONFIG[t.status];
  const today = new Date().toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" });

  const handlePrint = () => {
    const win = window.open("", "_blank", "width=900,height=700");
    if (!win) return;
    const printArea = document.getElementById("approval-print-area");
    if (!printArea) return;
    win.document.write(`
      <!DOCTYPE html><html><head><title>Payment Request #${String(t.id).padStart(4,"0")}</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: Arial, sans-serif; font-size: 11px; color: #191c1e; padding: 24px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 0; }
        td, th { border: 1px solid #191c1e; padding: 4px 8px; vertical-align: middle; }
        th { background: #f2f4f6; font-weight: bold; }
        .text-right { text-align: right; } .text-center { text-align: center; }
        .font-bold { font-weight: bold; } .bg-gray { background: #f2f4f6; }
        @page { margin: 1.5cm; } @media print { body { padding: 0; } }
      </style></head><body>${printArea.innerHTML}</body></html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 400);
  };

  return (
    <div className="bg-white border border-[#c2c7d1] rounded-2xl shadow-sm flex flex-col overflow-hidden">
      {/* Panel Header */}
      <div className="px-6 py-4 border-b border-[#c2c7d1] bg-[#f7f9fb] flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#727780]">
              Request #{String(t.id).padStart(4, "0")}
            </p>
            <h3 className="text-[15px] font-bold text-[#00355f] leading-tight">{t.description}</h3>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${sc.bg} ${sc.text} ${sc.border}`}>
            {sc.icon} {t.status}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#c2c7d1] rounded-lg text-[11px] font-bold text-[#505f76] hover:bg-[#f2f4f6] transition-colors"
          >
            <Printer size={14} /> Print
          </button>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[#727780] hover:text-[#00355f] hover:bg-[#00355f]/10 transition-colors">
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">

        {/* ── PRINTABLE AREA ── */}
        <div id="approval-print-area" className="p-6 space-y-6">

          {/* Company + date */}
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[17px] font-bold text-[#00355f] tracking-tight">Company Name</p>
              <p className="text-[10px] uppercase tracking-widest text-[#727780] mt-0.5">Payment Request Form</p>
            </div>
            <div className="text-right text-[12px]">
              <p><span className="font-bold">Date：</span>{today}</p>
              <p className="text-[10px] text-[#727780] mt-0.5">Ref: EXP-{new Date().getFullYear()}-{String(t.id).padStart(4,"0")}</p>
            </div>
          </div>

          {/* Employee info grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-[#f7f9fb] border border-[#c2c7d1] rounded-xl p-4">
            <InfoRow label="Employee ID" value={t.employeeId} />
            <InfoRow label="Name" value={t.employeeName} />
            <InfoRow label="Ext." value="—" />
            <InfoRow label="Department" value={t.department} />
            <InfoRow label="Project No." value={t.projectNo} />
            <InfoRow label="Due Date" value={t.date} />
          </div>

          {/* Description */}
          <div className="bg-[#f7f9fb] border border-[#c2c7d1] rounded-xl p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#727780] mb-1">Description</p>
            <p className="text-[13px] text-[#1a2e3f]">{t.description}</p>
          </div>

          {/* Transaction breakdown table */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#727780] mb-2">Transaction Details</p>
            <div className="border border-[#c2c7d1] rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse text-[12px]">
                <thead>
                  <tr className="bg-[#f7f9fb] border-b border-[#c2c7d1]">
                    <th className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-[#727780]">Date</th>
                    <th className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-[#727780]">Description</th>
                    <th className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-[#727780]">Unit</th>
                    <th className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-[#727780]">Item</th>
                    <th className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-[#727780] text-right">Pay Out</th>
                    <th className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-[#727780] text-right">VAT</th>
                    <th className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-[#727780] text-right">W/O VAT</th>
                    <th className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-[#727780] text-right">Delivery</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-[#f0f7ff]">
                    <td className="px-3 py-2.5 text-[#505f76]">{t.date}</td>
                    <td className="px-3 py-2.5 text-[#1a2e3f] font-medium">{t.description}</td>
                    <td className="px-3 py-2.5 text-[#505f76]">{t.unit}</td>
                    <td className="px-3 py-2.5 text-[#505f76]">{t.item}</td>
                    <td className="px-3 py-2.5 text-right font-bold text-[#ba1a1a]">₱{fmt(t.payOut)}</td>
                    <td className="px-3 py-2.5 text-right text-[#505f76]">{t.VAT > 0 ? `₱${fmt(t.VAT)}` : "—"}</td>
                    <td className="px-3 py-2.5 text-right text-[#505f76]">₱{fmt(t.withoutVAT)}</td>
                    <td className="px-3 py-2.5 text-right text-[#505f76]">₱{fmt(t.deliveryFee)}</td>
                  </tr>
                  {/* Totals */}
                  <tr className="bg-[#f7f9fb] border-t border-[#c2c7d1] font-bold">
                    <td className="px-3 py-2" colSpan={4}>TOTAL</td>
                    <td className="px-3 py-2 text-right text-[#ba1a1a]">₱{fmt(t.payOut)}</td>
                    <td className="px-3 py-2 text-right">{t.VAT > 0 ? `₱${fmt(t.VAT)}` : "—"}</td>
                    <td className="px-3 py-2 text-right">₱{fmt(t.withoutVAT)}</td>
                    <td className="px-3 py-2 text-right">₱{fmt(t.deliveryFee)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Currency + amounts */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#f7f9fb] border border-[#c2c7d1] rounded-xl p-4 space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#727780]">Currency</p>
              <div className="flex flex-wrap">
                <Checkbox checked={t.currency === "USD"} label="USD" />
                <Checkbox checked={t.currency === "PHP"} label="PHP" />
                <Checkbox checked={t.currency === "Other"} label="Other" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#727780] mt-2">Payment Method</p>
              <div className="flex flex-wrap">
                <Checkbox checked={t.paymentMethod === "T/T"} label="T/T" />
                <Checkbox checked={t.paymentMethod === "Cash"} label="Cash" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#727780] mt-2">Payable To</p>
              <div className="flex flex-wrap">
                <Checkbox checked={t.payeeTo === "Employee"} label="Employee" />
                <Checkbox checked={t.payeeTo === "Supplier"} label={`Supplier${t.supplierName ? `: ${t.supplierName}` : ""}`} />
              </div>
            </div>

            <div className="bg-[#f7f9fb] border border-[#c2c7d1] rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-[#c2c7d1]">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#727780]">Total Amount</span>
                <span className="text-[15px] font-extrabold text-[#ba1a1a]">₱{fmt(t.payOut)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[#c2c7d1]">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#727780]">
                  Withheld {t.withheldAmount > 0 && <span className="normal-case font-normal">(note)</span>}
                </span>
                <span className="text-[13px] font-semibold text-[#505f76]">
                  {t.withheldAmount > 0 ? `–₱${fmt(t.withheldAmount)}` : "—"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#727780]">Net Amount</span>
                <span className="text-[16px] font-extrabold text-emerald-700">₱{fmt(net)}</span>
              </div>
            </div>
          </div>

          {/* Invoice note */}
          {t.invoiceNote && (
            <div className="bg-[#f7f9fb] border border-[#c2c7d1] rounded-xl p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#727780] mb-1">Invoice / Receipt</p>
              <p className="text-[13px] text-[#1a2e3f]">{t.invoiceNote}</p>
            </div>
          )}

          {/* ── SIGNATURE CHAIN ── */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#727780] mb-3">
              Approval Chain：Applicant → Supervisor → Director → FA
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {t.signatures.map((sig) => (
                <div
                  key={sig.role}
                  className={`border rounded-xl p-4 flex flex-col gap-2 transition-colors
                    ${sig.signed
                      ? "bg-emerald-50 border-emerald-200"
                      : "bg-[#f7f9fb] border-[#c2c7d1] border-dashed"
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#727780]">{sig.role}</span>
                    {sig.signed
                      ? <span className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center"><Check size={11} color="white" /></span>
                      : <span className="w-5 h-5 rounded-full border-2 border-dashed border-[#c2c7d1]" />
                    }
                  </div>
                  {sig.signed ? (
                    <>
                      <p className="text-[13px] font-semibold text-[#1a2e3f] leading-tight">{sig.signedBy}</p>
                      <p className="text-[10px] text-[#727780]">{sig.signedAt}</p>
                    </>
                  ) : (
                    <div className="mt-2 border-b border-dashed border-[#c2c7d1] pb-4">
                      <p className="text-[10px] text-[#a0a8b3] italic">Awaiting signature</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Note */}
          <p className="text-[10px] text-[#a0a8b3]">
            Note: If there is any withholding payment, please specify the reason in the withheld field.
          </p>
        </div>
        {/* ── END PRINTABLE AREA ── */}

        {/* Admin actions (not printed) */}
        <div className="px-6 pb-6 space-y-4 border-t border-[#c2c7d1] pt-5">
          {/* Remarks */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#727780] block mb-1.5">
              Admin Remarks
            </label>
            <textarea
              value={t.remarks}
              onChange={(e) => onRemarksChange(t.id, e.target.value)}
              placeholder="Add notes or reason for approval/rejection…"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] focus:ring-2 focus:ring-[#00355f]/20 focus:border-[#00355f] outline-none resize-none h-20 transition-all"
            />
            {t.remarks && (
              <p className="mt-1 text-[11px] text-[#505f76] italic">"{t.remarks}"</p>
            )}
          </div>

          {/* Approve / Reject buttons */}
          {t.status === "Pending" && (
            <div className="flex gap-3">
              <button
                onClick={() => onApprove(t.id)}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-[0.98] text-[13px]"
              >
                <Check size={16} /> Approve Request
              </button>
              <button
                onClick={() => onReject(t.id)}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-white hover:bg-red-50 text-[#ba1a1a] font-bold rounded-xl shadow-sm border-2 border-[#ba1a1a] transition-all active:scale-[0.98] text-[13px]"
              >
                <XCircle size={16} /> Reject Request
              </button>
            </div>
          )}

          {t.status !== "Pending" && (
            <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-[13px] font-semibold
              ${t.status === "Approved" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-red-50 border-red-200 text-[#ba1a1a]"}`}>
              {t.status === "Approved" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              This request has been <strong className="ml-1">{t.status}</strong>.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}