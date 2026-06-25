import { useState } from "react";
import { Save, Undo2, Copy } from "lucide-react";
import { cls, FieldLabel, ToastBanner, CardSection, useToast } from "./Settingsshared";

export default function GeneralTab() {
  const { toast, show } = useToast();
  const [systemName, setSystemName] = useState("Petty Cash System");
  const [timezone, setTimezone]     = useState("manila");
  const [currency, setCurrency]     = useState("PHP");
  const [fiscalStart, setFiscalStart] = useState("01");
  const [copied, setCopied]         = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("PCS-F-2026-XT").catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <CardSection
      header={
        <div>
          <h3 className={cls.headlineSm}>General Configuration</h3>
          <p className={`${cls.bodySm} mt-1`}>Core application identity and regional settings.</p>
        </div>
      }
      footer={
        <>
          <ToastBanner toast={toast} />
          <button className={cls.btnSecondary} onClick={() => {
            setSystemName("Petty Cash System");
            setTimezone("manila");
            show({ type: "success", message: "Changes discarded." });
          }}>
            <Undo2 size={14} className="inline mr-1.5" /> Discard Changes
          </button>
          <button className={cls.btnPrimary}
            onClick={() => show({ type: "success", message: "System configuration saved." })}>
            <Save size={14} className="inline mr-1.5" /> Save Configuration
          </button>
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <FieldLabel>System Name</FieldLabel>
          <input className={cls.input} value={systemName} onChange={(e) => setSystemName(e.target.value)} />
        </div>

        <div className="space-y-1.5">
          <FieldLabel>Instance ID</FieldLabel>
          <div className={cls.inputReadonly}>
            <span className="font-mono">PCS-F-2026-XT</span>
            <button onClick={handleCopy} className="text-[#505f76] hover:text-[#00355f] transition-colors" title="Copy">
              <Copy size={15} />
            </button>
          </div>
          {copied && <p className="text-[11px] text-[#0f4c81]">Copied to clipboard.</p>}
        </div>

        <div className="space-y-1.5">
          <FieldLabel>Default Currency</FieldLabel>
          <select className={cls.select} value={currency} onChange={(e) => setCurrency(e.target.value)}>
            <option value="PHP">₱ PHP — Philippine Peso</option>
            <option value="USD">$ USD — US Dollar</option>
            <option value="EUR">€ EUR — Euro</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <FieldLabel>Fiscal Year Start Month</FieldLabel>
          <select className={cls.select} value={fiscalStart} onChange={(e) => setFiscalStart(e.target.value)}>
            {["January","February","March","April","May","June","July","August","September","October","November","December"]
              .map((m, i) => (
                <option key={m} value={String(i + 1).padStart(2, "0")}>{m}</option>
              ))}
          </select>
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <FieldLabel>Time Zone</FieldLabel>
          <select className={cls.select} value={timezone} onChange={(e) => setTimezone(e.target.value)}>
            <option value="manila">(GMT+08:00) Manila / Asia Pacific</option>
            <option value="eastern">(GMT-05:00) Eastern Time (US & Canada)</option>
            <option value="london">(GMT+00:00) London</option>
            <option value="berlin">(GMT+01:00) Berlin</option>
            <option value="tokyo">(GMT+09:00) Tokyo</option>
          </select>
        </div>
      </div>
    </CardSection>
  );
}