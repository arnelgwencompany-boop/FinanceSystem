import type { Transaction, PaymentRequestForm } from "../../types/requests";

type Props = {
  transactions: Transaction[];
  form: PaymentRequestForm;
  printRef: React.RefObject<HTMLDivElement>;
};

function fmt(n: number) {
  return n.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function Checkbox({ checked, label }: { checked: boolean; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 mr-4 text-[11px]">
      <span className="border border-[#191c1e] w-3 h-3 inline-flex items-center justify-center text-[9px] font-bold">
        {checked ? "■" : "□"}
      </span>
      {label}
    </span>
  );
}

export default function PrintableForm({ transactions, form, printRef }: Props) {
  const totalPayOut = transactions.reduce((s, t) => s + t.payOut, 0);
  const totalVAT = transactions.reduce((s, t) => s + t.VAT, 0);
  const totalWithoutVAT = transactions.reduce((s, t) => s + t.withoutVAT, 0);
  const totalDelivery = transactions.reduce((s, t) => s + t.deliveryFee, 0);
  const netAmount = totalPayOut - (form.withheldAmount || 0);
  const today = new Date().toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" });

  if (transactions.length === 0) {
    return (
      <div className="bg-white border border-dashed border-[#c2c7d1] rounded-2xl flex flex-col items-center justify-center py-20 text-center">
        <div className="text-4xl mb-4">📄</div>
        <p className="text-[14px] font-semibold text-[#505f76]">No transactions selected</p>
        <p className="text-[12px] text-[#a0a8b3] mt-1">Select at least one transaction from the left panel to preview the form.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#c2c7d1] rounded-2xl shadow-sm overflow-hidden">
      {/* Screen-only label */}
      <div className="px-6 py-3 bg-[#f7f9fb] border-b border-[#c2c7d1] flex items-center justify-between print:hidden">
        <span className="text-[11px] font-bold uppercase tracking-widest text-[#727780]">Form Preview</span>
        <span className="text-[11px] text-[#a0a8b3]">This is what will print</span>
      </div>

      {/* ===== PRINTABLE AREA ===== */}
      <div
        ref={printRef}
        className="p-10 font-[Arial,sans-serif] text-[12px] text-[#191c1e]"
        style={{ fontFamily: "Arial, sans-serif" }}
      >
        {/* Company + Date row */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-[18px] font-bold text-[#00355f] tracking-tight">Company Name</p>
            <p className="text-[11px] text-[#727780] mt-0.5 uppercase tracking-wide">Payment Request Form</p>
          </div>
          <div className="text-right text-[12px]">
            <p><span className="font-bold">Date：</span>{today}</p>
            <p className="text-[10px] text-[#727780] mt-1">
              Ref: EXP-{new Date().getFullYear()}-{String(transactions[0]?.id ?? "").padStart(4, "0")}
            </p>
          </div>
        </div>

        {/* Employee Info table */}
        <table className="w-full border-collapse mb-0 text-[11px]" style={{ borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td className="border border-[#191c1e] px-2 py-1.5 font-bold w-[110px] bg-[#f2f4f6]">Employee ID</td>
              <td className="border border-[#191c1e] px-2 py-1.5 w-[130px]">{form.employeeId}</td>
              <td className="border border-[#191c1e] px-2 py-1.5 font-bold w-[60px] bg-[#f2f4f6]">Name</td>
              <td className="border border-[#191c1e] px-2 py-1.5 w-[130px]">{form.employeeName}</td>
              <td className="border border-[#191c1e] px-2 py-1.5 font-bold w-[40px] bg-[#f2f4f6]">Ext.</td>
              <td className="border border-[#191c1e] px-2 py-1.5 w-[60px]">{form.ext}</td>
              <td className="border border-[#191c1e] px-2 py-1.5 font-bold w-[50px] bg-[#f2f4f6]">Dept.</td>
              <td className="border border-[#191c1e] px-2 py-1.5 w-[80px]">{form.department}</td>
              <td className="border border-[#191c1e] px-2 py-1.5 font-bold w-[80px] bg-[#f2f4f6]">Project No.</td>
              <td className="border border-[#191c1e] px-2 py-1.5 w-[90px]">{form.projectNo}</td>
              <td className="border border-[#191c1e] px-2 py-1.5 font-bold w-[70px] bg-[#f2f4f6]">Due Date</td>
              <td className="border border-[#191c1e] px-2 py-1.5">{form.dueDate}</td>
            </tr>
          </tbody>
        </table>

        {/* Description label */}
        <table className="w-full border-collapse text-[11px]" style={{ borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td className="border border-[#191c1e] px-2 py-1 font-bold bg-[#f2f4f6] w-[110px]">Description：</td>
              <td className="border border-[#191c1e] px-2 py-1" colSpan={11}></td>
            </tr>
          </tbody>
        </table>

        {/* Transactions detail table */}
        <table className="w-full border-collapse text-[11px] mb-0" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr className="bg-[#f2f4f6]">
              <th className="border border-[#191c1e] px-2 py-1.5 text-left font-bold w-[90px]">Date</th>
              <th className="border border-[#191c1e] px-2 py-1.5 text-left font-bold">Description</th>
              <th className="border border-[#191c1e] px-2 py-1.5 text-left font-bold w-[50px]">Dept</th>
              <th className="border border-[#191c1e] px-2 py-1.5 text-right font-bold w-[90px]">Pay Out</th>
              <th className="border border-[#191c1e] px-2 py-1.5 text-right font-bold w-[75px]">VAT</th>
              <th className="border border-[#191c1e] px-2 py-1.5 text-right font-bold w-[90px]">W/O VAT</th>
              <th className="border border-[#191c1e] px-2 py-1.5 text-right font-bold w-[80px]">Delivery</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id}>
                <td className="border border-[#191c1e] px-2 py-1.5">{t.date}</td>
                <td className="border border-[#191c1e] px-2 py-1.5">{t.description}</td>
                <td className="border border-[#191c1e] px-2 py-1.5">{t.department}</td>
                <td className="border border-[#191c1e] px-2 py-1.5 text-right">₱{fmt(t.payOut)}</td>
                <td className="border border-[#191c1e] px-2 py-1.5 text-right">{t.VAT > 0 ? `₱${fmt(t.VAT)}` : "—"}</td>
                <td className="border border-[#191c1e] px-2 py-1.5 text-right">₱{fmt(t.withoutVAT)}</td>
                <td className="border border-[#191c1e] px-2 py-1.5 text-right">₱{fmt(t.deliveryFee)}</td>
              </tr>
            ))}
            {/* Totals row */}
            <tr className="font-bold bg-[#f2f4f6]">
              <td className="border border-[#191c1e] px-2 py-1.5" colSpan={3}>TOTAL</td>
              <td className="border border-[#191c1e] px-2 py-1.5 text-right">₱{fmt(totalPayOut)}</td>
              <td className="border border-[#191c1e] px-2 py-1.5 text-right">{totalVAT > 0 ? `₱${fmt(totalVAT)}` : "—"}</td>
              <td className="border border-[#191c1e] px-2 py-1.5 text-right">₱{fmt(totalWithoutVAT)}</td>
              <td className="border border-[#191c1e] px-2 py-1.5 text-right">₱{fmt(totalDelivery)}</td>
            </tr>
          </tbody>
        </table>

        {/* Currency + Amounts block */}
        <table className="w-full border-collapse text-[11px]" style={{ borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td className="border border-[#191c1e] px-2 py-2 w-1/2" rowSpan={3}>
                <span className="font-bold">Currency ：</span>
                <Checkbox checked={form.currency === "USD"} label="USD" />
                <Checkbox checked={form.currency === "PHP"} label="PHP" />
                <Checkbox checked={form.currency === "Other"} label="Other" />
              </td>
              <td className="border border-[#191c1e] px-2 py-2 font-bold bg-[#f2f4f6] w-[120px]">Total amount：</td>
              <td className="border border-[#191c1e] px-2 py-2 font-mono text-right">₱{fmt(totalPayOut)}</td>
            </tr>
            <tr>
              <td className="border border-[#191c1e] px-2 py-2 font-bold bg-[#f2f4f6]">
                Withheld amount{form.withheldNote ? ` (${form.withheldNote})` : " (note)"}：
              </td>
              <td className="border border-[#191c1e] px-2 py-2 font-mono text-right">
                {form.withheldAmount > 0 ? `₱${fmt(form.withheldAmount)}` : "—"}
              </td>
            </tr>
            <tr>
              <td className="border border-[#191c1e] px-2 py-2 font-bold bg-[#f2f4f6]">Net amount：</td>
              <td className="border border-[#191c1e] px-2 py-2 font-mono font-bold text-right">₱{fmt(netAmount)}</td>
            </tr>
          </tbody>
        </table>

        {/* Payment method + payee */}
        <table className="w-full border-collapse text-[11px]" style={{ borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td className="border border-[#191c1e] px-2 py-2" colSpan={2}>
                <span className="font-bold">Payment Method：</span>
                <Checkbox checked={form.paymentMethod === "T/T"} label="T/T" />
                <Checkbox checked={form.paymentMethod === "Cash"} label="Cash" />
              </td>
            </tr>
            <tr>
              <td className="border border-[#191c1e] px-2 py-2" colSpan={2}>
                <Checkbox checked={form.payeeTo === "Employee"} label="Employee" />
                <Checkbox checked={form.payeeTo === "Supplier"} label={`Supplier：${form.payeeTo === "Supplier" ? form.supplierName : ""}`} />
              </td>
            </tr>
            <tr>
              <td className="border border-[#191c1e] px-2 py-2" colSpan={2}>
                <span className="font-bold">Process：</span>
                <span className="ml-2">Applicant → Supervisor → Director → FA</span>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Signature row */}
        <table className="w-full border-collapse text-[11px]" style={{ borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              {["Applicant", "Supervisor", "Director", "Approval"].map((role) => (
                <td key={role} className="border border-[#191c1e] px-2 py-8 text-center font-bold bg-[#f2f4f6] w-1/4">
                  {role}
                </td>
              ))}
            </tr>
            <tr>
              {["Applicant", "Supervisor", "Director", "Approval"].map((role) => (
                <td key={role} className="border border-[#191c1e] px-2 py-6"></td>
              ))}
            </tr>
          </tbody>
        </table>

        {/* Invoice note */}
        <table className="w-full border-collapse text-[11px]" style={{ borderCollapse: "collapse" }}>
          <tbody>
            <tr>
              <td className="border border-[#191c1e] px-2 py-2 font-bold bg-[#f2f4f6] w-[120px]">Invoice/Receipt：</td>
              <td className="border border-[#191c1e] px-2 py-2 min-h-[36px]">{form.invoiceNote}</td>
            </tr>
            <tr>
              <td className="border border-[#191c1e] px-2 py-2 text-[10px] text-[#505f76]" colSpan={2}>
                Note: If there is any withholding payment, please specify the reason in the withheld field.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}