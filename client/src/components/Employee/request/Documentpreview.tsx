import { forwardRef, useState } from "react";
import { FileText, Printer, X, ZoomIn } from "lucide-react";
import type { RequestFormData } from "../../../types/requestForm";
import { sym, money } from "../../../types/requestForm";

interface Props {
  data: RequestFormData;
  printRef: React.RefObject<HTMLDivElement>;
  onPrint: () => void;
}

// ─── Document preview — mirrors the sample payment request form ───────────────
const DocumentPreview = forwardRef<HTMLDivElement, Props>(({ data, printRef, onPrint }, _ref) => {
  const [expanded, setExpanded] = useState(false);
  const s      = sym(data.currency);
  const total  = (parseFloat(data.amount)||0) + (parseFloat(data.delivery_fee)||0);

  const Doc = ({ forPrint = false }: { forPrint?: boolean }) => (
    <div
      ref={forPrint ? printRef : undefined}
      className={`bg-white border border-slate-300 text-[12px] text-[#191c1e]`}
      style={{ fontFamily:"Arial,sans-serif", padding: forPrint ? "24px" : "20px" }}
    >
      {/* Header */}
      <div style={{ textAlign:"center", marginBottom:"16px" }}>
        <p style={{ fontWeight:"bold", fontSize:"14px" }}>Company Name</p>
        <p style={{ fontSize:"11px", color:"#64748b", marginTop:"2px" }}>Payment Request Form</p>
      </div>
      <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:"8px" }}>
        <span style={{ fontSize:"11px" }}>Date: <strong>{data.date || "—"}</strong></span>
      </div>

      {/* Row 1: identification */}
      <table style={{ width:"100%", borderCollapse:"collapse", marginBottom:"8px" }}>
        <thead>
          <tr>
            {["Employee ID","Name / Dept","Ext.","Project No.","Due Date"].map((h) => (
              <th key={h} style={{ border:"1px solid #94a3b8", padding:"4px 8px", background:"#f2f4f6", fontSize:"10px", fontWeight:"bold", textTransform:"uppercase", letterSpacing:"0.04em", color:"#64748b" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border:"1px solid #94a3b8", padding:"5px 8px", fontFamily:"monospace" }}>{data.employee_id||"—"}</td>
            <td style={{ border:"1px solid #94a3b8", padding:"5px 8px" }}>{data.department||"—"}</td>
            <td style={{ border:"1px solid #94a3b8", padding:"5px 8px" }}>{data.ext||"—"}</td>
            <td style={{ border:"1px solid #94a3b8", padding:"5px 8px", fontFamily:"monospace" }}>{data.project_no||"—"}</td>
            <td style={{ border:"1px solid #94a3b8", padding:"5px 8px" }}>{data.due_date||"—"}</td>
          </tr>
        </tbody>
      </table>

      {/* Description */}
      <table style={{ width:"100%", borderCollapse:"collapse", marginBottom:"8px" }}>
        <tbody>
          <tr>
            <td style={{ border:"1px solid #94a3b8", padding:"4px 8px", background:"#f2f4f6", fontWeight:"bold", fontSize:"10px", textTransform:"uppercase", color:"#64748b", width:"100px" }}>Description</td>
            <td style={{ border:"1px solid #94a3b8", padding:"6px 8px", minHeight:"36px" }}>
              {data.description || <span style={{ color:"#cbd5e1" }}>—</span>}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Currency + Amounts */}
      <table style={{ width:"100%", borderCollapse:"collapse", marginBottom:"8px" }}>
        <tbody>
          <tr>
            <td style={{ border:"1px solid #94a3b8", padding:"5px 8px", background:"#f2f4f6", fontWeight:"bold", fontSize:"10px", textTransform:"uppercase", color:"#64748b", width:"160px" }}>
              Currency:&nbsp;
              {["PHP","USD","Other"].map((c) => (
                <span key={c} style={{ marginRight:"8px" }}>{data.currency===c?"■":"□"} {c}</span>
              ))}
            </td>
            <td style={{ border:"1px solid #94a3b8", padding:"5px 8px" }}>
              <strong>Total amount: </strong>{s}{money(total)}
            </td>
          </tr>
          <tr>
            <td style={{ border:"1px solid #94a3b8", padding:"5px 8px", background:"#f2f4f6", fontWeight:"bold", fontSize:"10px", textTransform:"uppercase", color:"#64748b" }}>VAT</td>
            <td style={{ border:"1px solid #94a3b8", padding:"5px 8px" }}>{s}{money(data.vat)}</td>
          </tr>
          <tr>
            <td style={{ border:"1px solid #94a3b8", padding:"5px 8px", background:"#f2f4f6", fontWeight:"bold", fontSize:"10px", textTransform:"uppercase", color:"#64748b" }}>Without VAT</td>
            <td style={{ border:"1px solid #94a3b8", padding:"5px 8px" }}>{s}{money(data.without_vat)}</td>
          </tr>
          <tr>
            <td style={{ border:"1px solid #94a3b8", padding:"5px 8px", background:"#f2f4f6", fontWeight:"bold", fontSize:"10px", textTransform:"uppercase", color:"#64748b" }}>Delivery Fee</td>
            <td style={{ border:"1px solid #94a3b8", padding:"5px 8px" }}>{s}{money(data.delivery_fee)}</td>
          </tr>
        </tbody>
      </table>

      {/* Payment method + Payee */}
      <table style={{ width:"100%", borderCollapse:"collapse", marginBottom:"8px" }}>
        <tbody>
          <tr>
            <td style={{ border:"1px solid #94a3b8", padding:"5px 8px" }}>
              <strong>Payment Method: </strong>
              {data.payment_method==="CASH"?"■":"□"} Cash &nbsp;&nbsp;
              {data.payment_method==="T/T"?"■":"□"} T/T
            </td>
          </tr>
          <tr>
            <td style={{ border:"1px solid #94a3b8", padding:"5px 8px" }}>
              <strong>Payee: </strong>
              {data.payee_type==="EMPLOYEE"?"■":"□"} Employee &nbsp;&nbsp;
              {data.payee_type==="SUPPLIER"?"■":"□"} Supplier:&nbsp;
              {data.payee_type==="SUPPLIER" ? (data.payee_name || "—") : ""}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Process */}
      <table style={{ width:"100%", borderCollapse:"collapse", marginBottom:"8px" }}>
        <tbody>
          <tr>
            <td style={{ border:"1px solid #94a3b8", padding:"5px 8px", background:"#f2f4f6", fontWeight:"bold", fontSize:"10px", textTransform:"uppercase", color:"#64748b", width:"100px" }}>Process</td>
            <td style={{ border:"1px solid #94a3b8", padding:"5px 8px" }}>Applicant → Supervisor → Director → FA</td>
          </tr>
        </tbody>
      </table>

      {/* Signature row */}
      <table style={{ width:"100%", borderCollapse:"collapse", marginBottom:"8px" }}>
        <thead>
          <tr>
            {["Applicant","Supervisor","Director","Approval (FA)"].map((h) => (
              <th key={h} style={{ border:"1px solid #94a3b8", padding:"5px 8px", background:"#f2f4f6", fontSize:"10px", fontWeight:"bold", textTransform:"uppercase", color:"#64748b" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border:"1px solid #94a3b8", height:"40px" }}></td>
            <td style={{ border:"1px solid #94a3b8", height:"40px" }}></td>
            <td style={{ border:"1px solid #94a3b8", height:"40px" }}></td>
            <td style={{ border:"1px solid #94a3b8", height:"40px" }}></td>
          </tr>
        </tbody>
      </table>

      {/* Invoice/Receipt */}
      <table style={{ width:"100%", borderCollapse:"collapse", marginBottom:"8px" }}>
        <tbody>
          <tr>
            <td style={{ border:"1px solid #94a3b8", padding:"5px 8px", background:"#f2f4f6", fontWeight:"bold", fontSize:"10px", textTransform:"uppercase", color:"#64748b" }}>Invoice / Receipt</td>
          </tr>
          <tr>
            <td style={{ border:"1px solid #94a3b8", height:"32px", padding:"5px 8px" }}></td>
          </tr>
        </tbody>
      </table>

      {/* Note */}
      <table style={{ width:"100%", borderCollapse:"collapse" }}>
        <tbody>
          <tr>
            <td style={{ border:"1px solid #94a3b8", padding:"5px 8px", background:"#f2f4f6", fontWeight:"bold", fontSize:"10px", textTransform:"uppercase", color:"#64748b", width:"60px" }}>Note</td>
            <td style={{ border:"1px solid #94a3b8", padding:"5px 8px" }}>
              {data.note || <span style={{ color:"#cbd5e1" }}>If there is any withholding payment, please specify.</span>}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      {/* Sticky preview card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden sticky top-24">
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText size={17} className="text-[#00355f]"/>
            <h2 className="text-[16px] font-bold text-[#00355f]">Document Preview</h2>
            <span className="text-[11px] text-slate-400 font-medium ml-1">Updates as you type</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setExpanded(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-xl text-[12px] font-bold text-[#00355f] hover:bg-slate-50 transition-colors">
              <ZoomIn size={13}/> Full View
            </button>
            <button onClick={onPrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00355f] rounded-xl text-[12px] font-bold text-white hover:bg-[#0f4c81] transition-colors">
              <Printer size={13}/> Print
            </button>
          </div>
        </div>

        {/* Hidden printable ref */}
        <div className="hidden"><Doc forPrint /></div>

        {/* Visible scaled preview */}
        <div className="p-4 overflow-auto max-h-[580px] bg-slate-100">
          <div className="transform origin-top-left scale-[0.82] w-[122%]">
            <Doc />
          </div>
        </div>
      </div>

      {/* Full-screen modal */}
      {expanded && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h2 className="text-[16px] font-bold text-[#00355f]">Payment Request Form — Full View</h2>
              <div className="flex gap-2">
                <button onClick={onPrint}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#00355f] rounded-xl text-[13px] font-bold text-white hover:bg-[#0f4c81] transition-colors">
                  <Printer size={14}/> Print / Save PDF
                </button>
                <button onClick={() => setExpanded(false)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors">
                  <X size={18}/>
                </button>
              </div>
            </div>
            <div className="p-6 overflow-auto max-h-[75vh]">
              <Doc />
            </div>
          </div>
        </div>
      )}
    </>
  );
});

DocumentPreview.displayName = "DocumentPreview";
export default DocumentPreview;