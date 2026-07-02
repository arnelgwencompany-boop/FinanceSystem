import { useState, useRef } from "react";
import { FileText, Send, Save, X, CheckCircle2, ArrowLeft } from "lucide-react";
import type { RequestFormData } from "../../types/requestForm";
import { EMPTY } from "../../types/requestForm";
import { RequestorSection, DescriptionSection, FinancialSection, PayeeSection } from "../../components/Employee/request/Formsections";
import DocumentPreview from "../../components/Employee/request/Documentpreview";
import { createRequest } from "../../apis/employeeRequest";
import LoadingScreen from "../../components/ui/LoadingScreen";


function validate(data: RequestFormData): Record<string, string> {
  const e: Record<string, string> = {};
  if (!data.employee_id.trim())  e.employee_id  = "Employee ID is required.";
  if (!data.department.trim())   e.department   = "Department is required.";
  if (!data.date)                e.date         = "Date is required.";
  if (!data.due_date)            e.due_date     = "Due date is required.";
  if (!data.description.trim())  e.description  = "Description is required.";
  if (!data.amount || parseFloat(data.amount) <= 0) e.amount = "Please enter a valid amount.";
  if (data.payee_type === "SUPPLIER" && !data.payee_name.trim())
    e.payee_name = "Supplier name is required.";
  return e;
}

export default function EmployeeRequestPage() {
  const [form,   setForm]   = useState<RequestFormData>(() => {
    // Pre-fill from localStorage user profile
    try {
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      return {
        ...EMPTY,
        employee_id: u.employeeId || "",
        department:  u.department  || "",
      };
    } catch { return EMPTY; }
  });
  const [errors,  setErrors]  = useState<Record<string, string>>({});
  const [status,  setStatus]  = useState<"idle" | "loading" | "success">("idle");
  const printRef = useRef<HTMLDivElement>(null!);
  const [loading, setLoading] = useState(false);

  const set = <K extends keyof RequestFormData>(k: K, v: RequestFormData[K]) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStatus("loading");
    setLoading(true);
    // POST /api/requests/ — replace with real API call
    createRequest(form)
      .then(() => setStatus("success"))
      .catch((error) => {
        console.error("Error creating request:", error);
        setStatus("idle");
      })
      .finally(() => setLoading(false));
  };

  const handleDraft = () => {
    alert("Draft saved successfully.");
  };

  const handleReset = () => {
    setForm(EMPTY);
    setErrors({});
    setStatus("idle");
  };

  const handlePrint = () => {
    if (!printRef.current) return;
    const win = window.open("", "_blank", "width=900,height=700");
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><title>Payment Request</title>
      <style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:Arial,sans-serif;font-size:12px;padding:24px}
      table{width:100%;border-collapse:collapse;margin-bottom:8px}
      td,th{border:1px solid #94a3b8;padding:5px 8px}
      th{background:#f2f4f6;font-weight:bold;font-size:10px;text-transform:uppercase;letter-spacing:0.04em;color:#64748b}
      @media print{body{padding:16px}@page{margin:1cm}}</style>
      </head><body>${printRef.current.innerHTML}</body></html>`);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 400);
  };

  // laoding screen
  if (loading) {
    return (
      <LoadingScreen message="Submitting request…" />
    );
  }

  // ── Success screen ─────────────────────────────────────────────────────────
  if (status === "success") {
    return (
      <main className="ml-[270px] mt-16 min-h-[calc(100vh-64px)] bg-[#f7f9fb] flex items-center justify-center p-8">
        <div className="bg-white rounded-3xl shadow-lg p-12 flex flex-col items-center text-center max-w-md w-full">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 size={44} className="text-emerald-600"/>
          </div>
          <h2 className="text-[24px] font-extrabold text-[#00355f] mb-2">Request Submitted!</h2>
          <p className="text-[16px] text-slate-500 mb-2">Your request has been sent for approval.</p>
          <p className="text-[14px] text-slate-400 mb-8">You will be notified once it is reviewed.</p>
          <button onClick={handleReset}
            className="flex items-center gap-2 px-6 py-3 bg-[#00355f] text-white text-[16px] font-bold rounded-xl hover:bg-[#0f4c81] transition-colors">
            <ArrowLeft size={18}/> Submit Another Request
          </button>
        </div>
      </main>
    );
  }

  const sectionProps = { data: form, errors, set };

  return (
    <main className="mt-5 min-h-[calc(100vh-64px)] bg-[#f7f9fb] overflow-y-auto">
      <div className="px-8 py-8 max-w-[1700px] mx-auto">

        {/* ── Page header ──────────────────────────────────────────────────── */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#00355f] flex items-center justify-center flex-shrink-0">
            <FileText size={22} color="white"/>
          </div>
          <div>
            <h1 className="text-[24px] font-extrabold text-[#00355f] leading-tight">Payment Request Form</h1>
            <p className="text-[15px] text-slate-500 mt-0.5">Fill in the form — the document preview updates in real time.</p>
          </div>
        </div>

        {/* ── Split layout ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_480px] gap-6 items-start">

          {/* LEFT — form ───────────────────────────────────────────────────── */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <RequestorSection  {...sectionProps}/>
            <DescriptionSection {...sectionProps}/>
            <FinancialSection  {...sectionProps}/>
            <PayeeSection      {...sectionProps}/>

            {/* Action buttons */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-6 py-5 flex flex-col sm:flex-row items-center gap-3">
              <button type="submit" disabled={status === "loading"}
                className="flex items-center justify-center gap-2.5 px-8 py-4 bg-[#00355f] text-white text-[16px] font-bold rounded-xl hover:bg-[#0f4c81] transition-all shadow-sm w-full sm:w-auto disabled:opacity-70">
                {status === "loading"
                  ? <><span className="animate-spin inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"/> Submitting…</>
                  : <><Send size={18}/> Submit Request</>}
              </button>
              <button type="button" onClick={handleDraft}
                className="flex items-center justify-center gap-2.5 px-8 py-4 bg-white text-[#00355f] border-2 border-[#00355f] text-[16px] font-bold rounded-xl hover:bg-slate-50 transition-all w-full sm:w-auto">
                <Save size={18}/> Save as Draft
              </button>
              <button type="button" onClick={handleReset}
                className="flex items-center justify-center gap-2.5 px-8 py-4 text-slate-500 border-2 border-slate-200 text-[16px] font-bold rounded-xl hover:bg-slate-50 transition-all w-full sm:w-auto">
                <X size={18}/> Clear Form
              </button>
            </div>
          </form>

          {/* RIGHT — live document preview ─────────────────────────────────── */}
          <DocumentPreview data={form} printRef={printRef} onPrint={handlePrint}/>
        </div>
      </div>
    </main>
  );
}