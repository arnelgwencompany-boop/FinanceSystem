import React, { useState, useRef } from "react";
import { ShieldCheck, TriangleAlert } from "lucide-react";

export type TabId = "general" | "user" | "notifications" | "integration" | "budget" | "approval" | "categories";

export interface Toast { type: "success" | "error"; message: string; }

export interface ApprovalLevel {
  id: number; role: string; label: string; threshold: number | null;
}

export interface ExpenseCategory {
  id: number; name: string; color: string; description: string; active: boolean;
}

export const cls = {
  cardBase:      "bg-white border border-[#c2c7d1] rounded-xl shadow-sm overflow-hidden",
  cardHeader:    "p-6 border-b border-[#c2c7d1] bg-[#f2f4f6]",
  cardBody:      "p-6",
  cardFooter:    "px-6 py-4 bg-[#f2f4f6] flex justify-end gap-3 border-t border-[#c2c7d1]",
  headlineLg:    "text-[24px] font-semibold leading-8 tracking-[-0.02em] text-[#00355f]",
  headlineSm:    "text-[16px] font-semibold leading-6 text-[#00355f]",
  headlineXs:    "text-[14px] font-semibold text-[#00355f]",
  bodyMd:        "text-[14px] leading-5 text-[#191c1e]",
  bodySm:        "text-[13px] leading-[18px] text-[#505f76]",
  labelCaps:     "text-[11px] font-bold tracking-[0.05em] uppercase text-[#505f76]",
  input:         "w-full border border-[#c2c7d1] rounded-lg px-4 py-2 text-[14px] text-[#191c1e] focus:border-[#00355f] focus:ring-1 focus:ring-[#00355f] outline-none transition-all bg-white",
  inputMono:     "w-full border border-[#c2c7d1] rounded-lg px-4 py-2 text-[14px] font-mono text-[#191c1e] focus:border-[#00355f] focus:ring-1 focus:ring-[#00355f] outline-none transition-all bg-white",
  inputReadonly: "w-full bg-[#e6e8ea] border border-[#c2c7d1] rounded-lg px-4 py-2 text-[14px] font-mono text-[#42474f] flex justify-between items-center",
  select:        "w-full border border-[#c2c7d1] rounded-lg px-4 py-2 text-[14px] text-[#191c1e] focus:border-[#00355f] focus:ring-1 focus:ring-[#00355f] outline-none transition-all bg-white",
  btnPrimary:    "px-6 py-2 text-[14px] font-semibold bg-[#0f4c81] text-white rounded-lg hover:bg-[#00355f] transition-all",
  btnSecondary:  "px-6 py-2 text-[14px] font-semibold text-[#505f76] hover:bg-[#c2c7d1] rounded-lg transition-all",
  btnGhost:      "flex items-center gap-2 px-4 py-2 text-[14px] font-semibold text-[#ba1a1a] hover:bg-[#ffdad6]/30 rounded-lg transition-all",
  btnIcon:       "px-3 bg-[#e6e8ea] border border-[#c2c7d1] rounded-lg hover:bg-[#c2c7d1] transition-colors flex items-center justify-center h-[38px]",
};

export const CATEGORY_COLORS = [
  "#0f4c81","#00355f","#3b6d11","#743b00",
  "#6b21a8","#0e7490","#be123c","#b45309",
];

// ─── Shared UI primitives ──────────────────────────────────────────────────────

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return <p className={cls.labelCaps}>{children}</p>;
}

export function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" className="sr-only peer" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <div className={[
        "w-11 h-6 rounded-full transition-colors",
        "after:content-[''] after:absolute after:top-[2px] after:left-[2px]",
        "after:bg-white after:border-gray-300 after:border after:rounded-full",
        "after:h-5 after:w-5 after:transition-all",
        "peer-checked:after:translate-x-full peer-checked:after:border-white",
        checked ? "bg-[#0f4c81]" : "bg-[#c2c7d1]",
      ].join(" ")} />
    </label>
  );
}

export function ToastBanner({ toast }: { toast: Toast | null }) {
  if (!toast) return null;
  const ok = toast.type === "success";
  return (
    <div className={[
      "flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-medium border",
      ok ? "bg-[#eaf3de] border-[#c0dd97] text-[#3b6d11]" : "bg-[#ffdad6] border-[#ffb4ab] text-[#93000a]",
    ].join(" ")}>
      {ok ? <ShieldCheck size={14} /> : <TriangleAlert size={14} />}
      {toast.message}
    </div>
  );
}

export function CardSection({ header, children, footer }: {
  header: React.ReactNode; children: React.ReactNode; footer?: React.ReactNode;
}) {
  return (
    <div className={cls.cardBase}>
      <div className={cls.cardHeader}>{header}</div>
      <div className={cls.cardBody}>{children}</div>
      {footer && <div className={cls.cardFooter}>{footer}</div>}
    </div>
  );
}

export function useToast() {
  const [toast, setToast] = useState<Toast | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const show = (t: Toast) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast(t);
    timerRef.current = setTimeout(() => setToast(null), 3500);
  };
  return { toast, show };
}