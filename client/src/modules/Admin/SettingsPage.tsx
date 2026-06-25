import React, { useState, useRef } from "react";
import {
  Sliders, User, Mail, Cable,
  Copy, Folder, Zap, Save, Undo2,
  TriangleAlert, ShieldCheck, CloudSync, History,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type TabId = "general" | "user" | "notifications" | "integration";

interface Toast {
  type: "success" | "error";
  message: string;
}

// ─── Design tokens (mirror your Tailwind config) ──────────────────────────────

const cls = {
  // surfaces
  cardBase:      "bg-white border border-[#c2c7d1] rounded-xl shadow-sm overflow-hidden",
  cardHeader:    "p-6 border-b border-[#c2c7d1] bg-[#f2f4f6]",
  cardBody:      "p-6",
  cardFooter:    "px-6 py-4 bg-[#f2f4f6] flex justify-end gap-3",

  // typography
  headlineLg:    "text-[24px] font-semibold leading-8 tracking-[-0.02em] text-[#00355f]",
  headlineSm:    "text-[16px] font-semibold leading-6 text-[#00355f]",
  headlineXs:    "text-[14px] font-semibold text-[#00355f]",
  bodyMd:        "text-[14px] leading-5 text-[#191c1e]",
  bodySm:        "text-[13px] leading-[18px] text-[#505f76]",
  labelCaps:     "text-[11px] font-bold tracking-[0.05em] uppercase text-[#505f76]",

  // inputs
  input:         "w-full border border-[#c2c7d1] rounded-lg px-4 py-2 text-[14px] leading-5 text-[#191c1e] focus:border-[#00355f] focus:ring-1 focus:ring-[#00355f] outline-none transition-all bg-white",
  inputMono:     "w-full border border-[#c2c7d1] rounded-lg px-4 py-2 text-[14px] font-mono text-[#191c1e] focus:border-[#00355f] focus:ring-1 focus:ring-[#00355f] outline-none transition-all bg-white",
  inputReadonly: "w-full bg-[#e6e8ea] border border-[#c2c7d1] rounded-lg px-4 py-2 text-[14px] font-mono text-[#42474f] flex justify-between items-center",
  select:        "w-full border border-[#c2c7d1] rounded-lg px-4 py-2 text-[14px] leading-5 text-[#191c1e] focus:border-[#00355f] focus:ring-1 focus:ring-[#00355f] outline-none transition-all bg-white",

  // buttons
  btnPrimary:    "px-6 py-2 text-[14px] font-semibold bg-[#0f4c81] text-white rounded-lg hover:shadow-md hover:bg-[#00355f] transition-all",
  btnSecondary:  "px-6 py-2 text-[14px] font-semibold text-[#505f76] hover:bg-[#c2c7d1] rounded-lg transition-all",
  btnGhost:      "flex items-center gap-2 px-4 py-2 text-[14px] font-semibold text-[#ba1a1a] hover:bg-[#ffdad6]/30 rounded-lg transition-all",
  btnIcon:       "px-3 bg-[#e6e8ea] border border-[#c2c7d1] rounded-lg hover:bg-[#c2c7d1] transition-colors flex items-center justify-center",
};

// ─── Reusable pieces ──────────────────────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <p className={cls.labelCaps}>{children}</p>;
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div
        className={[
          "w-11 h-6 rounded-full transition-colors",
          "after:content-[''] after:absolute after:top-[2px] after:left-[2px]",
          "after:bg-white after:border-gray-300 after:border after:rounded-full",
          "after:h-5 after:w-5 after:transition-all",
          "peer-checked:after:translate-x-full peer-checked:after:border-white",
          checked ? "bg-[#0f4c81]" : "bg-[#c2c7d1]",
        ].join(" ")}
      />
    </label>
  );
}

function ToastBanner({ toast }: { toast: Toast | null }) {
  if (!toast) return null;
  const ok = toast.type === "success";
  return (
    <div
      className={[
        "flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-medium border",
        ok
          ? "bg-[#eaf3de] border-[#c0dd97] text-[#3b6d11]"
          : "bg-[#ffdad6] border-[#ffb4ab] text-[#93000a]",
      ].join(" ")}
    >
      {ok ? <ShieldCheck size={14} /> : <TriangleAlert size={14} />}
      {toast.message}
    </div>
  );
}

function CardSection({
  header,
  children,
  footer,
}: {
  header: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className={cls.cardBase}>
      <div className={cls.cardHeader}>{header}</div>
      <div className={cls.cardBody}>{children}</div>
      {footer && <div className={cls.cardFooter}>{footer}</div>}
    </div>
  );
}

// ─── useToast ─────────────────────────────────────────────────────────────────

function useToast() {
  const [toast, setToast] = useState<Toast | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const show = (t: Toast) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast(t);
    timerRef.current = setTimeout(() => setToast(null), 3500);
  };
  return { toast, show };
}

// ─── Tab: General ─────────────────────────────────────────────────────────────

function GeneralTab() {
  const { toast, show } = useToast();
  const [systemName, setSystemName] = useState("Global Asset Ledger Pro");
  const [timezone, setTimezone] = useState("eastern");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("AL-F-8892-XT").catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <CardSection
      header={
        <div>
          <h3 className={cls.headlineSm}>General Configuration</h3>
          <p className={`${cls.bodySm} mt-1`}>
            Core application identity and regional settings.
          </p>
        </div>
      }
      footer={
        <>
          <ToastBanner toast={toast} />
          <button
            className={cls.btnSecondary}
            onClick={() => {
              setSystemName("Global Asset Ledger Pro");
              setTimezone("eastern");
              show({ type: "success", message: "Changes discarded." });
            }}
          >
            <Undo2 size={14} className="inline mr-1.5" />
            Discard Changes
          </button>
          <button
            className={cls.btnPrimary}
            onClick={() =>
              show({ type: "success", message: "System configuration saved." })
            }
          >
            <Save size={14} className="inline mr-1.5" />
            Save System Configuration
          </button>
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <FieldLabel>System Name</FieldLabel>
          <input
            className={cls.input}
            value={systemName}
            onChange={(e) => setSystemName(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <FieldLabel>Instance ID</FieldLabel>
          <div className={cls.inputReadonly}>
            <span className="font-mono">AL-F-8892-XT</span>
            <button
              onClick={handleCopy}
              className="text-[#505f76] hover:text-[#00355f] transition-colors"
              title="Copy"
            >
              <Copy size={15} />
            </button>
          </div>
          {copied && (
            <p className="text-[11px] text-[#0f4c81]">Copied to clipboard.</p>
          )}
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <FieldLabel>Time Zone</FieldLabel>
          <select
            className={cls.select}
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
          >
            <option value="eastern">(GMT-05:00) Eastern Time (US &amp; Canada)</option>
            <option value="london">(GMT+00:00) London</option>
            <option value="berlin">(GMT+01:00) Berlin</option>
            <option value="tokyo">(GMT+09:00) Tokyo</option>
            <option value="manila">(GMT+08:00) Manila / Asia Pacific</option>
          </select>
        </div>
      </div>
    </CardSection>
  );
}

// ─── Tab: User Profile ────────────────────────────────────────────────────────

function UserTab() {
  const { toast, show } = useToast();
  const [name, setName]   = useState("Jane Doe");
  const [email, setEmail] = useState("jane.doe@assetledger.com");
  const [pwNew, setPwNew] = useState("");
  const [pwConf, setPwConf] = useState("");

  const handleSave = () => {
    if (!name.trim() || !email.trim()) {
      show({ type: "error", message: "Name and email are required." });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      show({ type: "error", message: "Enter a valid email address." });
      return;
    }
    if (pwNew && pwNew !== pwConf) {
      show({ type: "error", message: "Passwords do not match." });
      return;
    }
    show({ type: "success", message: "Profile updated successfully." });
    setPwNew(""); setPwConf("");
  };

  return (
    <CardSection
      header={
        <div className="flex items-center justify-between">
          <div>
            <h3 className={cls.headlineSm}>User Profile</h3>
            <p className={`${cls.bodySm} mt-1`}>
              Manage your personal information and security.
            </p>
          </div>
          {/* Avatar */}
          <div className="relative group cursor-pointer">
            <div className="w-16 h-16 rounded-full border-4 border-white shadow-md bg-[#d0e1fb] flex items-center justify-center text-[#00355f] font-bold text-xl select-none overflow-hidden">
              JD
            </div>
            <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <User size={18} className="text-white" />
            </div>
          </div>
        </div>
      }
      footer={
        <>
          <ToastBanner toast={toast} />
          <button className={cls.btnPrimary} onClick={handleSave}>
            Update Profile
          </button>
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <FieldLabel>Full Name</FieldLabel>
          <input
            className={cls.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <FieldLabel>Admin Role</FieldLabel>
          <div className={cls.inputReadonly}>
            <span className="font-semibold text-[#0f4c81]">
              Super Administrator
            </span>
          </div>
        </div>

        <div className="space-y-1.5 md:col-span-2">
          <FieldLabel>Email Address</FieldLabel>
          <input
            type="email"
            className={cls.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Change Password */}
        <div className="md:col-span-2 pt-2 border-t border-[#c2c7d1]">
          <h4 className={`${cls.headlineXs} mb-4`}>Change Password</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <FieldLabel>New Password</FieldLabel>
              <input
                type="password"
                className={cls.input}
                placeholder="Enter new password"
                value={pwNew}
                onChange={(e) => setPwNew(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <FieldLabel>Confirm New Password</FieldLabel>
              <input
                type="password"
                className={cls.input}
                placeholder="Confirm new password"
                value={pwConf}
                onChange={(e) => setPwConf(e.target.value)}
              />
            </div>
          </div>
          {/* Strength bar */}
          {pwNew && (
            <div className="mt-2">
              {(() => {
                const score = [/.{8,}/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter(
                  (r) => r.test(pwNew)
                ).length;
                const meta = [
                  { label: "Weak",   color: "bg-[#ba1a1a]", w: "25%" },
                  { label: "Weak",   color: "bg-[#ba1a1a]", w: "25%" },
                  { label: "Fair",   color: "bg-[#743b00]", w: "50%" },
                  { label: "Good",   color: "bg-[#0f4c81]", w: "75%" },
                  { label: "Strong", color: "bg-[#3b6d11]", w: "100%" },
                ][score];
                return (
                  <>
                    <div className="h-1.5 bg-[#e6e8ea] rounded-full overflow-hidden">
                      <div
                        className={`h-full ${meta.color} rounded-full transition-all`}
                        style={{ width: meta.w }}
                      />
                    </div>
                    <p className="text-[11px] text-[#505f76] mt-1">
                      Strength:{" "}
                      <span className="font-semibold text-[#191c1e]">
                        {meta.label}
                      </span>
                    </p>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </CardSection>
  );
}

// ─── Tab: Notifications ───────────────────────────────────────────────────────

function NotificationsTab() {
  const { toast, show } = useToast();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [freq, setFreq] = useState<"realtime" | "daily" | "weekly">("daily");
  const [events, setEvents] = useState({
    bulkUploads:    true,
    highValue:      true,
    backupConfirm:  false,
    approvalAction: true,
    lowBalance:     true,
  });

  const toggleEvent = (k: keyof typeof events) =>
    setEvents((p) => ({ ...p, [k]: !p[k] }));

  const eventRows: { key: keyof typeof events; label: string }[] = [
    { key: "bulkUploads",    label: "New Bulk Uploads (Completed)" },
    { key: "highValue",      label: "High-Value Asset Threshold Breach (>₱50,000)" },
    { key: "backupConfirm",  label: "System Backup Confirmations" },
    { key: "approvalAction", label: "Approval Actions (Approved / Rejected)" },
    { key: "lowBalance",     label: "Low Petty Cash Balance Warning" },
  ];

  return (
    <div className={cls.cardBase}>
      <div className={cls.cardHeader}>
        <h3 className={cls.headlineSm}>Notification Settings</h3>
        <p className={`${cls.bodySm} mt-1`}>
          Control how and when you receive system alerts.
        </p>
      </div>

      <div className={`${cls.cardBody} space-y-6`}>
        {/* Email toggle */}
        <div className="flex items-start justify-between p-4 border border-[#c2c7d1] rounded-lg bg-[#f7f9fb]">
          <div className="flex gap-4">
            <Mail size={20} className="text-[#00355f] mt-0.5 flex-shrink-0" />
            <div>
              <p className={cls.headlineXs}>Email Alerts</p>
              <p className={`${cls.bodySm} mt-0.5`}>
                Receive digests of transaction approvals and asset movements.
              </p>
            </div>
          </div>
          <Toggle checked={emailAlerts} onChange={setEmailAlerts} />
        </div>

        {/* Frequency */}
        <div className="space-y-2">
          <FieldLabel>Digest Frequency</FieldLabel>
          <div className="flex flex-wrap gap-6">
            {(
              [
                ["realtime", "Real-time"],
                ["daily",    "Daily Summary"],
                ["weekly",   "Weekly Report"],
              ] as const
            ).map(([val, label]) => (
              <label
                key={val}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="freq"
                  className="text-[#00355f] focus:ring-[#00355f] h-4 w-4"
                  checked={freq === val}
                  onChange={() => setFreq(val)}
                />
                <span className={cls.bodyMd}>{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Specific events */}
        <div>
          <h4 className={`${cls.headlineXs} mb-3`}>Specific Events</h4>
          <div className="space-y-1">
            {eventRows.map((r) => (
              <label
                key={r.key}
                className="flex items-center gap-4 p-2 hover:bg-[#f2f4f6] rounded-lg transition-all cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="rounded border-[#c2c7d1] text-[#00355f] focus:ring-[#00355f] h-4 w-4"
                  checked={events[r.key]}
                  onChange={() => toggleEvent(r.key)}
                />
                <span className={cls.bodyMd}>{r.label}</span>
              </label>
            ))}
          </div>
        </div>

        <ToastBanner toast={toast} />
        <div className="flex justify-end">
          <button
            className={cls.btnPrimary}
            onClick={() =>
              show({ type: "success", message: "Notification preferences saved." })
            }
          >
            Save Notification Settings
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Tab: System Integration ──────────────────────────────────────────────────

function IntegrationTab() {
  const { toast, show } = useToast();
  const [testing, setTesting] = useState(false);
  const [testOk, setTestOk]   = useState<boolean | null>(null);

  const [server, setServer]   = useState("LN-HQ-01.corp.internal");
  const [port, setPort]       = useState("1352");
  const [nsf, setNsf]         = useState("/mail/assets/ledger_v4.nsf");
  const [exportPath, setExportPath] = useState("\\\\SHARE-FINANCE\\Ledger\\Exports\\Daily");
  const [autoSync, setAutoSync]     = useState(true);

  const handleTest = () => {
    setTesting(true);
    setTestOk(null);
    setTimeout(() => {
      setTesting(false);
      setTestOk(true);
      show({ type: "success", message: "Lotus Notes server connection verified." });
    }, 1800);
  };

  return (
    <div className={cls.cardBase}>
      {/* Header */}
      <div className={cls.cardHeader}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className={cls.headlineSm}>System Integration</h3>
            <p className={`${cls.bodySm} mt-1`}>
              Connect with Lotus Notes and define export workflows.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-[#93000a] bg-[#ffdad6] px-3 py-1 rounded-full">
            <TriangleAlert size={13} />
            <span className="text-[11px] font-bold tracking-wide uppercase">
              Legacy Protocol
            </span>
          </div>
        </div>
      </div>

      <div className={`${cls.cardBody} space-y-8`}>
        {/* Lotus Notes */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Cable size={18} className="text-[#00355f]" />
            <h4 className={cls.headlineXs}>Lotus Notes Server Settings</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pl-4 border-l-2 border-[#c2c7d1]">
            <div className="space-y-1.5">
              <FieldLabel>Server Address</FieldLabel>
              <input
                className={cls.inputMono}
                value={server}
                onChange={(e) => setServer(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <FieldLabel>Port</FieldLabel>
              <input
                className={cls.inputMono}
                value={port}
                onChange={(e) => setPort(e.target.value)}
              />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <FieldLabel>Database Path (.NSF)</FieldLabel>
              <input
                className={cls.inputMono}
                value={nsf}
                onChange={(e) => setNsf(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Export Paths */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Folder size={18} className="text-[#00355f]" />
            <h4 className={cls.headlineXs}>Automated Export Paths</h4>
          </div>
          <div className="space-y-4 pl-4 border-l-2 border-[#c2c7d1]">
            <div className="space-y-1.5">
              <FieldLabel>Default CSV Export Directory</FieldLabel>
              <div className="flex gap-2">
                <input
                  className={cls.inputMono}
                  value={exportPath}
                  onChange={(e) => setExportPath(e.target.value)}
                />
                <button className={cls.btnIcon} title="Browse folder">
                  <Folder size={16} className="text-[#505f76]" />
                </button>
              </div>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-[#c2c7d1] text-[#00355f] focus:ring-[#00355f] h-4 w-4"
                checked={autoSync}
                onChange={(e) => setAutoSync(e.target.checked)}
              />
              <span className={cls.bodySm}>
                Auto-sync with corporate SharePoint every 24 hours
              </span>
            </label>
          </div>
        </div>

        {/* Connection test result */}
        {testOk === true && (
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-medium bg-[#eaf3de] border border-[#c0dd97] text-[#3b6d11]">
            <ShieldCheck size={14} /> Lotus Notes server is reachable and responding.
          </div>
        )}
        {testOk === false && (
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-medium bg-[#ffdad6] border border-[#ffb4ab] text-[#93000a]">
            <TriangleAlert size={14} /> Could not reach {server}. Verify the address and port.
          </div>
        )}

        <ToastBanner toast={toast} />
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-[#f2f4f6] border-t border-[#c2c7d1] flex justify-between items-center">
        <button
          className={cls.btnGhost}
          onClick={handleTest}
          disabled={testing}
        >
          <Zap size={15} />
          {testing ? "Testing…" : "Test Connection"}
        </button>
        <button
          className={cls.btnPrimary}
          onClick={() =>
            show({ type: "success", message: "Integration settings saved." })
          }
        >
          Save Integration Map
        </button>
      </div>
    </div>
  );
}

// ─── Info footer cards ────────────────────────────────────────────────────────

const INFO_CARDS = [
  {
    icon: ShieldCheck,
    title: "Data Sovereignty",
    body: "All system setting changes are logged in the immutable audit ledger for compliance tracking.",
  },
  {
    icon: CloudSync,
    title: "Sync Integrity",
    body: "Integration tests verify server handshakes before committing new path configurations.",
  },
  {
    icon: History,
    title: "Rollback Points",
    body: "System-wide configurations can be reverted to any of the last 5 major snapshots if needed.",
  },
];

// ─── Tab config ───────────────────────────────────────────────────────────────

const TABS: { id: TabId; icon: React.ElementType; label: string }[] = [
  { id: "general",      icon: Sliders,        label: "General"            },
  { id: "user",         icon: User,           label: "User Profile"       },
  { id: "notifications",icon: Mail,           label: "Notifications"      },
  { id: "integration",  icon: Cable,          label: "System Integration" },
];

// ─── Root ─────────────────────────────────────────────────────────────────────

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>("general");

  const content: Record<TabId, React.ReactNode> = {
    general:       <GeneralTab />,
    user:          <UserTab />,
    notifications: <NotificationsTab />,
    integration:   <IntegrationTab />,
  };

  return (
    /* Offset for fixed sidebar (240px) and fixed header (64px) */
    <div className="ml-[240px] pt-16 min-h-screen bg-[#f7f9fb]">
      <div className="p-8 max-w-[1740px] mx-auto">

        {/* Page heading */}
        <div className="mb-8">
          <h2 className={cls.headlineLg}>System Settings</h2>
          <p className={`${cls.bodySm} mt-1`}>
            Manage your global ledger configuration and account preferences.
          </p>
        </div>

        {/* Bento layout */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Side tab nav */}
          <aside className="w-full lg:w-64 shrink-0">
            <nav className="flex lg:flex-col gap-1 bg-white border border-[#c2c7d1] rounded-xl p-2 shadow-sm overflow-x-auto lg:overflow-visible">
              {TABS.map(({ id, icon: Icon, label }) => {
                const active = activeTab === id;
                return (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={[
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-left transition-all duration-200",
                      "text-[14px] leading-5 w-full",
                      active
                        ? "bg-[#0f4c81] text-[#8ebdf9] font-semibold"
                        : "text-[#505f76] hover:bg-[#e6e8ea]",
                    ].join(" ")}
                  >
                    <Icon size={17} />
                    {label}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Panel */}
          <div className="flex-1 min-w-0">{content[activeTab]}</div>
        </div>

        {/* Info footer */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {INFO_CARDS.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="bg-[#00355f]/5 border border-[#00355f]/10 rounded-xl p-6"
            >
              <Icon size={22} className="text-[#00355f] mb-3" />
              <h5 className={`${cls.headlineXs} mb-1`}>{title}</h5>
              <p className={cls.bodySm}>{body}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Settings;