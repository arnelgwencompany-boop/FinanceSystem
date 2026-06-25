import React, { useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  CheckCheck,
  Bell,
  FilePlus,
  Wallet,
  Mail,
  Trash2,
  RefreshCw,
  Circle,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type NotifType = "Approval" | "Request" | "Budget" | "System" | "LotusNotes";
type FilterTab = "All" | NotifType;

interface Notification {
  id: number;
  type: NotifType;
  title: string;
  message: string;
  date: string;
  read: boolean;
  tag?: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────
const INITIAL: Notification[] = [
  {
    id: 1, type: "Request", read: false, date: "Today, 10:24 AM",
    tag: "REQ-2026-006",
    title: "New Petty Cash Request",
    message: "Rosa Tan (GO Dept.) submitted a new request for ₱950.00 — Office supplies Q1 restock. Awaiting your review.",
  },
  {
    id: 2, type: "Approval", read: false, date: "Today, 09:47 AM",
    tag: "REQ-2026-003",
    title: "Request Approved",
    message: "Your request REQ-2026-003 for Network Switch (24-port) worth ₱8,500.00 has been approved by the Finance team.",
  },
  {
    id: 3, type: "Budget", read: false, date: "Today, 09:15 AM",
    title: "Budget Limit Warning",
    message: "The IT Ops department has consumed 85% of its Q2 petty cash budget. Consider reviewing pending requests before approving new ones.",
  },
  {
    id: 4, type: "Approval", read: false, date: "Today, 08:50 AM",
    tag: "REQ-2026-004",
    title: "Request Rejected",
    message: "REQ-2026-004 (UPS Battery Backup, ₱4,200.00) was rejected. Reason: Amount exceeds single-transaction limit.",
  },
  {
    id: 5, type: "LotusNotes", read: true, date: "Yesterday, 04:12 PM",
    title: "IBM Lotus Notes — New Mail",
    message: "Finance Circular No. 12-2026: Updated petty cash disbursement guidelines effective Q3 2026. Please read and acknowledge.",
  },
  {
    id: 6, type: "Request", read: true, date: "Yesterday, 02:30 PM",
    tag: "REQ-2026-005",
    title: "New Petty Cash Request",
    message: "Paolo Mendoza (Marketing) submitted REQ-2026-005 for Printer cartridges (bulk) worth ₱1,500.00.",
  },
  {
    id: 7, type: "Budget", read: true, date: "Jun 22, 11:00 AM",
    title: "Monthly Budget Reset",
    message: "Petty cash budget for all departments has been reset for the new period. Current fund balance: ₱97,000.10.",
  },
  {
    id: 8, type: "LotusNotes", read: true, date: "Jun 21, 03:00 PM",
    title: "IBM Lotus Notes — Meeting Invite",
    message: "You have been invited to the Q2 Finance Review meeting on June 30, 2026 at 2:00 PM. Please confirm attendance.",
  },
  {
    id: 9, type: "System", read: true, date: "Jun 20, 08:00 AM",
    title: "System Maintenance Complete",
    message: "Scheduled system upgrade completed successfully. All modules are operating normally. No action required.",
  },
];

// ─── Config maps ──────────────────────────────────────────────────────────────
const TYPE_META: Record<NotifType, {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  tabColor: string;
}> = {
  Request: {
    icon: <FilePlus size={17} />,
    iconBg: "bg-blue-50 text-[#00355f]",
    label: "Request",
    tabColor: "bg-blue-100 text-blue-700",
  },
  Approval: {
    icon: <CheckCircle2 size={17} />,
    iconBg: "bg-emerald-50 text-emerald-700",
    label: "Approval",
    tabColor: "bg-emerald-100 text-emerald-700",
  },
  Budget: {
    icon: <Wallet size={17} />,
    iconBg: "bg-amber-50 text-amber-700",
    label: "Budget",
    tabColor: "bg-amber-100 text-amber-700",
  },
  System: {
    icon: <Info size={17} />,
    iconBg: "bg-slate-100 text-slate-500",
    label: "System",
    tabColor: "bg-slate-100 text-slate-600",
  },
  LotusNotes: {
    icon: <Mail size={17} />,
    iconBg: "bg-purple-50 text-purple-700",
    label: "Lotus Notes",
    tabColor: "bg-purple-100 text-purple-700",
  },
};

const TABS: FilterTab[] = ["All", "Request", "Approval", "Budget", "LotusNotes", "System"];

// ─── Component ────────────────────────────────────────────────────────────────
const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL);
  const [activeTab, setActiveTab]         = useState<FilterTab>("All");
  const [syncing, setSyncing]             = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = activeTab === "All"
    ? notifications
    : notifications.filter((n) => n.type === activeTab);

  const markAllRead = () =>
    setNotifications((p) => p.map((n) => ({ ...n, read: true })));

  const markOneRead = (id: number) =>
    setNotifications((p) =>
      p.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  const deleteOne = (id: number) =>
    setNotifications((p) => p.filter((n) => n.id !== id));

  const syncLotus = () => {
    setSyncing(true);
    setTimeout(() => {
      setNotifications((p) => [
        {
          id: Date.now(), type: "LotusNotes", read: false,
          date: "Just now",
          title: "IBM Lotus Notes — New Mail",
          message: "IT Department Memo: Reminder to submit all petty cash liquidation reports by June 30, 2026.",
        },
        ...p,
      ]);
      setSyncing(false);
    }, 1500);
  };

  return (
    <main className="ml-[260px] mt-16 min-h-[calc(100vh-64px)] bg-[#f7f9fb] overflow-y-auto">
      <div className="px-8 py-8 max-w-[1740px] mx-auto">

        {/* ── Page Header ──────────────────────────────────────────────────── */}
        <div className="flex justify-between items-start mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00355f] flex items-center justify-center">
              <Bell size={18} color="white" />
            </div>
            <div>
              <h1 className="text-[22px] font-extrabold text-[#00355f] leading-tight">
                Notifications
              </h1>
              <p className="text-[12px] text-[#727780] mt-0.5">
                {unreadCount > 0
                  ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                  : "You're all caught up"}
              </p>
            </div>
          </div>

          <div className="flex gap-2 flex-shrink-0">
            {/* Sync IBM Lotus Notes */}
            <button
              onClick={syncLotus}
              disabled={syncing}
              className="flex items-center gap-2 px-4 py-2 border border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 text-[12px] font-bold rounded-xl transition-colors disabled:opacity-60"
            >
              <RefreshCw size={14} className={syncing ? "animate-spin" : ""} />
              {syncing ? "Syncing…" : "Sync Lotus Notes"}
            </button>

            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-[#00355f] text-[12px] font-bold rounded-xl transition-colors"
              >
                <CheckCheck size={14} />
                Mark all read
              </button>
            )}
          </div>
        </div>

        {/* ── Summary Cards ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {(["Request","Approval","Budget","LotusNotes"] as NotifType[]).map((type) => {
            const meta  = TYPE_META[type];
            const count = notifications.filter((n) => n.type === type && !n.read).length;
            return (
              <button
                key={type}
                onClick={() => setActiveTab(type)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                  activeTab === type
                    ? "bg-[#00355f] border-[#00355f] text-white shadow-sm"
                    : "bg-white border-slate-200 hover:border-[#00355f]/30 hover:bg-slate-50"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  activeTab === type ? "bg-white/15 text-white" : meta.iconBg
                }`}>
                  {meta.icon}
                </div>
                <div>
                  <p className={`text-[11px] font-semibold ${activeTab === type ? "text-white/70" : "text-[#727780]"}`}>
                    {meta.label}
                  </p>
                  <p className={`text-[16px] font-extrabold leading-tight ${activeTab === type ? "text-white" : "text-[#00355f]"}`}>
                    {count}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* ── Filter Tabs ──────────────────────────────────────────────────── */}
        <div className="flex gap-1 mb-4 bg-white border border-slate-200 rounded-xl p-1">
          {TABS.map((tab) => {
            const count = tab === "All"
              ? notifications.filter((n) => !n.read).length
              : notifications.filter((n) => n.type === tab && !n.read).length;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-[12px] font-semibold transition-all ${
                  activeTab === tab
                    ? "bg-[#00355f] text-white shadow-sm"
                    : "text-[#727780] hover:text-[#00355f] hover:bg-slate-50"
                }`}
              >
                {tab === "LotusNotes" ? "Lotus Notes" : tab}
                {count > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    activeTab === tab
                      ? "bg-white/20 text-white"
                      : "bg-[#00355f]/10 text-[#00355f]"
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── Notification Feed ────────────────────────────────────────────── */}
        <div className="space-y-2">
          {filtered.length === 0 && (
            <div className="bg-white border border-slate-200 border-dashed rounded-2xl py-16 flex flex-col items-center gap-2 text-center">
              <Bell size={28} className="text-slate-300" />
              <p className="text-[13px] font-semibold text-[#a0a8b3]">No notifications here</p>
              <p className="text-[12px] text-[#c2c7d1]">Switch tabs or check back later.</p>
            </div>
          )}

          {filtered.map((n) => {
            const meta = TYPE_META[n.type];
            return (
              <div
                key={n.id}
                className={`group relative bg-white rounded-xl border transition-all hover:shadow-sm ${
                  !n.read
                    ? "border-l-[3px] border-l-[#00355f] border-t-slate-200 border-r-slate-200 border-b-slate-200"
                    : "border-slate-200 opacity-80 hover:opacity-100"
                }`}
              >
                <div className="flex gap-3 px-4 py-3.5">
                  {/* Unread dot */}
                  <div className="flex-shrink-0 mt-1.5">
                    {!n.read
                      ? <Circle size={7} className="fill-[#00355f] text-[#00355f]" />
                      : <Circle size={7} className="fill-slate-200 text-slate-200" />
                    }
                  </div>

                  {/* Icon */}
                  <div className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${meta.iconBg}`}>
                    {meta.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className={`text-[13px] font-bold ${!n.read ? "text-[#0a1f3c]" : "text-[#404a55]"}`}>
                          {n.title}
                        </h3>
                        {n.tag && (
                          <span className="text-[10px] font-bold text-[#00355f] bg-[#00355f]/8 px-1.5 py-0.5 rounded font-mono">
                            {n.tag}
                          </span>
                        )}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${meta.tabColor}`}>
                          {meta.label}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#a0a8b3] font-mono shrink-0">{n.date}</span>
                    </div>

                    <p className="text-[12px] text-[#727780] leading-relaxed">{n.message}</p>

                    {/* Actions */}
                    <div className="flex items-center gap-3 mt-2">
                      {!n.read && (
                        <button
                          onClick={() => markOneRead(n.id)}
                          className="text-[11px] font-bold text-[#00355f] hover:underline"
                        >
                          Mark as read
                        </button>
                      )}
                      {n.type === "Request" && n.tag && (
                        <button className="text-[11px] font-bold text-[#00355f] hover:underline">
                          View request →
                        </button>
                      )}
                      {n.type === "LotusNotes" && (
                        <button className="text-[11px] font-bold text-purple-700 hover:underline">
                          Open in Lotus Notes →
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => deleteOne(n.id)}
                    className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-red-400 mt-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </main>
  );
};

export default Notifications;