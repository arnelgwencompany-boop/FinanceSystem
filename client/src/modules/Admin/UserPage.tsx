import { useState, useRef, useEffect } from "react";
import {
  Users, Plus, Search, Filter, ChevronDown,
  Edit2, Shield, ToggleLeft, ToggleRight,
  X, Eye, EyeOff, CheckCircle2, XCircle,
  User, Mail, Lock, Building2, Briefcase,
  MoreVertical, Crown, ClipboardList,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Role       = "Admin" | "Supervisor" | "Employee";
type Status     = "Active" | "Inactive";
type Department = "IT Ops" | "GA" | "GO" | "Marketing" | "Finance" | "HR";

interface SystemUser {
  id: number;
  name: string;
  email: string;
  role: Role;
  department: Department;
  status: Status;
  joined: string;
  lastActive: string;
  requestCount: number;
}

// ─── Mock data ────────────────────────────────────────────────────────────────
const INITIAL_USERS: SystemUser[] = [
  { id: 1, name: "Admin User",      email: "admin@company.com",   role: "Admin",      department: "IT Ops",   status: "Active",   joined: "2024-01-01", lastActive: "Today",         requestCount: 0  },
  { id: 2, name: "Maria Santos",    email: "m.santos@company.com",role: "Supervisor",  department: "Finance",  status: "Active",   joined: "2024-03-12", lastActive: "Today",         requestCount: 14 },
  { id: 3, name: "Carlos Reyes",    email: "c.reyes@company.com", role: "Employee",   department: "IT Ops",   status: "Active",   joined: "2024-05-20", lastActive: "Yesterday",     requestCount: 8  },
  { id: 4, name: "Ana Lim",         email: "a.lim@company.com",   role: "Employee",   department: "Marketing",status: "Active",   joined: "2024-06-01", lastActive: "Jun 22, 2026",  requestCount: 5  },
  { id: 5, name: "Paolo Mendoza",   email: "p.mendoza@company.com",role:"Employee",   department: "Marketing",status: "Inactive", joined: "2024-07-15", lastActive: "May 10, 2026",  requestCount: 3  },
  { id: 6, name: "Rosa Tan",        email: "r.tan@company.com",   role: "Employee",   department: "GO",       status: "Active",   joined: "2024-08-09", lastActive: "Today",         requestCount: 6  },
  { id: 7, name: "Jose Garcia",     email: "j.garcia@company.com",role: "Supervisor", department: "GA",       status: "Active",   joined: "2024-02-18", lastActive: "Jun 23, 2026",  requestCount: 22 },
  { id: 8, name: "Lena Cruz",       email: "l.cruz@company.com",  role: "Employee",   department: "HR",       status: "Inactive", joined: "2025-01-05", lastActive: "Apr 30, 2026",  requestCount: 1  },
];

const ROLES: Role[]             = ["Admin", "Supervisor", "Employee"];
const DEPARTMENTS: Department[] = ["IT Ops", "GA", "GO", "Marketing", "Finance", "HR"];
const STATUSES: Status[]        = ["Active", "Inactive"];

// ─── Style helpers ────────────────────────────────────────────────────────────
const roleMeta: Record<Role, { icon: React.ReactNode; bg: string; text: string }> = {
  Admin:      { icon: <Crown size={11} />,       bg: "bg-purple-100", text: "text-purple-700" },
  Supervisor: { icon: <Shield size={11} />,      bg: "bg-blue-100",   text: "text-[#00355f]"  },
  Employee:   { icon: <Briefcase size={11} />,   bg: "bg-slate-100",  text: "text-slate-600"  },
};

const statusMeta: Record<Status, { dot: string; text: string; bg: string }> = {
  Active:   { dot: "bg-emerald-400", text: "text-emerald-700", bg: "bg-emerald-50" },
  Inactive: { dot: "bg-slate-300",   text: "text-slate-500",   bg: "bg-slate-100"  },
};

const initials = (name: string) =>
  name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

const avatarColor = (id: number) => {
  const colors = [
    "bg-[#00355f] text-white", "bg-purple-600 text-white",
    "bg-emerald-600 text-white", "bg-amber-500 text-white",
    "bg-pink-600 text-white",   "bg-teal-600 text-white",
  ];
  return colors[id % colors.length];
};

const inputCls =
  "w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[13px] text-[#1a2e3f] focus:ring-2 focus:ring-[#00355f]/20 focus:border-[#00355f] outline-none transition-all placeholder:text-slate-400";

// ─── Modal ────────────────────────────────────────────────────────────────────
interface ModalProps {
  user?: SystemUser | null;
  onSave: (u: Omit<SystemUser, "id" | "joined" | "lastActive" | "requestCount">) => void;
  onClose: () => void;
}

function UserModal({ user, onSave, onClose }: ModalProps) {
  const isEdit = !!user;
  const [name,       setName]       = useState(user?.name       ?? "");
  const [email,      setEmail]      = useState(user?.email      ?? "");
  const [password,   setPassword]   = useState("");
  const [role,       setRole]       = useState<Role>(user?.role ?? "Employee");
  const [department, setDepartment] = useState<Department>(user?.department ?? "IT Ops");
  const [status,     setStatus]     = useState<Status>(user?.status ?? "Active");
  const [showPwd,    setShowPwd]    = useState(false);
  const [errors,     setErrors]     = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim())  e.name  = "Full name is required.";
    if (!email.trim()) e.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email.";
    if (!isEdit && !password) e.password = "Password is required.";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({ name, email, role, department, status });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Modal header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between"
          style={{ background: "linear-gradient(135deg,#00355f,#0f4c81)" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
              {isEdit ? <Edit2 size={17} color="white" /> : <Plus size={17} color="white" />}
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-white">{isEdit ? "Edit User" : "Add New User"}</h2>
              <p className="text-[11px] text-white/60 mt-0.5">
                {isEdit ? `Editing ${user?.name}` : "Fill in the details below"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Fields */}
        <div className="px-6 py-5 space-y-4">
          {/* Name */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-widest text-[#727780] mb-1.5 flex items-center gap-1.5">
              <User size={11} /> Full Name
            </label>
            <input value={name} onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Juan dela Cruz" className={inputCls} />
            {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-widest text-[#727780] mb-1.5 flex items-center gap-1.5">
              <Mail size={11} /> Email Address
            </label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. juan@company.com" className={inputCls} />
            {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-widest text-[#727780] mb-1.5 flex items-center gap-1.5">
              <Lock size={11} /> {isEdit ? "New Password (leave blank to keep)" : "Password"}
            </label>
            <div className="relative">
              <input type={showPwd ? "text" : "password"} value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isEdit ? "Leave blank to keep current" : "Min. 8 characters"}
                className={`${inputCls} pr-10`} />
              <button onClick={() => setShowPwd((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.password && <p className="text-[11px] text-red-500 mt-1">{errors.password}</p>}
          </div>

          {/* Role + Department */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-widest text-[#727780] mb-1.5 flex items-center gap-1.5">
                <Shield size={11} /> Role
              </label>
              <select value={role} onChange={(e) => setRole(e.target.value as Role)} className={inputCls}>
                {ROLES.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-widest text-[#727780] mb-1.5 flex items-center gap-1.5">
                <Building2 size={11} /> Department
              </label>
              <select value={department} onChange={(e) => setDepartment(e.target.value as Department)} className={inputCls}>
                {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>

          {/* Status */}
          {isEdit && (
            <div>
              <label className="text-[11px] font-bold uppercase tracking-widest text-[#727780] mb-1.5 block">
                Account Status
              </label>
              <div className="flex gap-2">
                {STATUSES.map((s) => (
                  <button key={s} onClick={() => setStatus(s)}
                    className={`flex-1 py-2 rounded-lg text-[12px] font-bold border transition-all ${
                      status === s
                        ? s === "Active"
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "bg-red-500 text-white border-red-500"
                        : "bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300"
                    }`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50">
          <button onClick={onClose}
            className="px-4 py-2 text-[12px] font-bold text-[#727780] border border-slate-200 rounded-xl hover:bg-white transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit}
            className="px-5 py-2 text-[12px] font-bold text-white bg-[#00355f] hover:bg-[#0f4c81] rounded-xl transition-colors">
            {isEdit ? "Save Changes" : "Create User"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Detail Drawer ────────────────────────────────────────────────────────────
function UserDrawer({ user, onClose, onEdit, onToggle }: {
  user: SystemUser;
  onClose: () => void;
  onEdit: () => void;
  onToggle: () => void;
}) {
  const rm = roleMeta[user.role];
  const sm = statusMeta[user.status];
  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="flex-1 bg-black/20" onClick={onClose} />
      <div className="w-80 bg-white h-full shadow-2xl flex flex-col overflow-y-auto">
        {/* Drawer header */}
        <div className="px-5 py-5 border-b border-slate-100"
          style={{ background: "linear-gradient(135deg,#00355f,#0f4c81)" }}>
          <div className="flex justify-between mb-4">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${rm.bg} ${rm.text} flex items-center gap-1`}>
              {rm.icon} {user.role}
            </span>
            <button onClick={onClose} className="text-white/60 hover:text-white"><X size={18} /></button>
          </div>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-[15px] font-extrabold ${avatarColor(user.id)}`}>
              {initials(user.name)}
            </div>
            <div>
              <h3 className="text-[15px] font-extrabold text-white">{user.name}</h3>
              <p className="text-[11px] text-white/60">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="px-5 py-5 space-y-4 flex-1">
          {[
            { label: "Department", value: user.department, icon: <Building2 size={13} /> },
            { label: "Joined",     value: user.joined,     icon: <ClipboardList size={13} /> },
            { label: "Last Active",value: user.lastActive,  icon: <User size={13} /> },
            { label: "Requests",   value: `${user.requestCount} submitted`, icon: <ClipboardList size={13} /> },
          ].map(({ label, value, icon }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[#727780]">
                {icon}
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#a0a8b3]">{label}</p>
                <p className="text-[13px] font-semibold text-[#1a2e3f]">{value}</p>
              </div>
            </div>
          ))}

          {/* Status */}
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${sm.bg}`}>
              {user.status === "Active"
                ? <CheckCircle2 size={13} className={sm.text} />
                : <XCircle size={13} className={sm.text} />
              }
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#a0a8b3]">Status</p>
              <span className={`text-[12px] font-bold ${sm.text}`}>{user.status}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-5 pb-6 space-y-2 border-t border-slate-100 pt-4">
          <button onClick={onEdit}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#00355f] hover:bg-[#0f4c81] text-white text-[13px] font-bold rounded-xl transition-colors">
            <Edit2 size={14} /> Edit User
          </button>
          {user.id !== 1 && (
            <button onClick={onToggle}
              className={`w-full flex items-center justify-center gap-2 py-2.5 text-[13px] font-bold rounded-xl border transition-colors ${
                user.status === "Active"
                  ? "border-red-200 text-red-600 hover:bg-red-50"
                  : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
              }`}>
              {user.status === "Active"
                ? <><ToggleLeft size={14} /> Deactivate</>
                : <><ToggleRight size={14} /> Activate</>
              }
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function UserManagement() {
  const [users,      setUsers]      = useState<SystemUser[]>(INITIAL_USERS);
  const [search,     setSearch]     = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "All">("All");
  const [deptFilter, setDeptFilter] = useState<Department | "All">("All");
  const [statFilter, setStatFilter] = useState<Status | "All">("All");
  const [showFilter, setShowFilter] = useState(false);
  const [modal,      setModal]      = useState<"add" | "edit" | null>(null);
  const [editTarget, setEditTarget] = useState<SystemUser | null>(null);
  const [drawer,     setDrawer]     = useState<SystemUser | null>(null);
  const [openMenu,   setOpenMenu]   = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const nextId  = useRef(INITIAL_USERS.length + 1);

  // Close menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpenMenu(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchQ    = u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchRole = roleFilter === "All" || u.role === roleFilter;
    const matchDept = deptFilter === "All" || u.department === deptFilter;
    const matchStat = statFilter === "All" || u.status === statFilter;
    return matchQ && matchRole && matchDept && matchStat;
  });

  const handleSave = (data: Omit<SystemUser, "id" | "joined" | "lastActive" | "requestCount">) => {
    if (modal === "edit" && editTarget) {
      setUsers((p) => p.map((u) => u.id === editTarget.id ? { ...u, ...data } : u));
      if (drawer?.id === editTarget.id) setDrawer((d) => d ? { ...d, ...data } : d);
    } else {
      const newUser: SystemUser = {
        ...data, id: nextId.current++,
        joined: new Date().toISOString().slice(0, 10),
        lastActive: "Just now", requestCount: 0,
      };
      setUsers((p) => [newUser, ...p]);
    }
    setModal(null); setEditTarget(null);
  };

  const toggleStatus = (id: number) => {
    setUsers((p) => p.map((u) =>
      u.id === id ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" } : u
    ));
    if (drawer?.id === id)
      setDrawer((d) => d ? { ...d, status: d.status === "Active" ? "Inactive" : "Active" } : d);
  };

  const openEdit = (u: SystemUser) => {
    setEditTarget(u); setModal("edit"); setDrawer(null); setOpenMenu(null);
  };

  // Summary counts
  const totalActive   = users.filter((u) => u.status === "Active").length;
  const totalAdmins   = users.filter((u) => u.role === "Admin").length;
  const totalInactive = users.filter((u) => u.status === "Inactive").length;

  return (
    <main className="ml-[260px] mt-16 min-h-[calc(100vh-64px)] bg-[#f7f9fb] overflow-y-auto">
      <div className="px-8 py-8 max-w-[1740px] mx-auto">

        {/* ── Page Header ──────────────────────────────────────────────────── */}
        <div className="flex justify-between items-start mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00355f] flex items-center justify-center">
              <Users size={18} color="white" />
            </div>
            <div>
              <h1 className="text-[22px] font-extrabold text-[#00355f] leading-tight">User Management</h1>
              <p className="text-[12px] text-[#727780] mt-0.5">
                {users.length} users · {totalActive} active
              </p>
            </div>
          </div>
          <button
            onClick={() => { setEditTarget(null); setModal("add"); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#00355f] hover:bg-[#0f4c81] text-white text-[13px] font-bold rounded-xl transition-colors shadow-sm"
          >
            <Plus size={16} /> Add User
          </button>
        </div>

        {/* ── Summary Cards ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total Users",   value: users.length,  icon: <Users size={16} />,       bg: "bg-[#00355f]",    text: "text-white" },
            { label: "Active",        value: totalActive,   icon: <CheckCircle2 size={16} />, bg: "bg-emerald-600",  text: "text-white" },
            { label: "Inactive",      value: totalInactive, icon: <XCircle size={16} />,      bg: "bg-slate-400",    text: "text-white" },
            { label: "Admins",        value: totalAdmins,   icon: <Crown size={16} />,         bg: "bg-purple-600",   text: "text-white" },
          ].map(({ label, value, icon, bg, text }) => (
            <div key={label} className={`${bg} rounded-xl px-5 py-4 flex items-center gap-3`}>
              <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center text-white">
                {icon}
              </div>
              <div>
                <p className="text-[11px] font-semibold text-white/70">{label}</p>
                <p className={`text-[22px] font-extrabold leading-tight ${text}`}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Search + Filter bar ──────────────────────────────────────────── */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm mb-4">
          <div className="px-5 py-3 flex gap-3 items-center border-b border-slate-100">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0a8b3]" />
              <input
                value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email…"
                className={`${inputCls} pl-8`}
              />
            </div>
            <button
              onClick={() => setShowFilter((v) => !v)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-[12px] font-bold transition-all ${
                showFilter
                  ? "bg-[#00355f] text-white border-[#00355f]"
                  : "bg-slate-50 text-[#727780] border-slate-200 hover:border-[#00355f] hover:text-[#00355f]"
              }`}
            >
              <Filter size={13} /> Filters
              <ChevronDown size={12} className={`transition-transform ${showFilter ? "rotate-180" : ""}`} />
            </button>
          </div>

          {showFilter && (
            <div className="px-5 py-4 flex gap-3 bg-slate-50">
              {[
                {
                  label: "Role", value: roleFilter,
                  options: ["All", ...ROLES],
                  onChange: (v: string) => setRoleFilter(v as Role | "All"),
                },
                {
                  label: "Department", value: deptFilter,
                  options: ["All", ...DEPARTMENTS],
                  onChange: (v: string) => setDeptFilter(v as Department | "All"),
                },
                {
                  label: "Status", value: statFilter,
                  options: ["All", ...STATUSES],
                  onChange: (v: string) => setStatFilter(v as Status | "All"),
                },
              ].map(({ label, value, options, onChange }) => (
                <div key={label} className="flex flex-col gap-1 flex-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#727780]">{label}</label>
                  <select value={value} onChange={(e) => onChange(e.target.value)} className={inputCls}>
                    {options.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              <div className="flex items-end">
                <button
                  onClick={() => { setRoleFilter("All"); setDeptFilter("All"); setStatFilter("All"); setSearch(""); }}
                  className="px-4 py-2 text-[12px] font-bold text-red-500 hover:text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          {/* ── Table ──────────────────────────────────────────────────────── */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  {["User", "Role", "Department", "Status", "Last Active", "Requests", ""].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-[#a0a8b3]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-14 text-center">
                      <p className="text-[13px] text-[#a0a8b3] font-semibold">No users match your search.</p>
                    </td>
                  </tr>
                )}
                {filtered.map((u) => {
                  const rm = roleMeta[u.role];
                  const sm = statusMeta[u.status];
                  return (
                    <tr key={u.id}
                      onClick={() => { setDrawer(u); setOpenMenu(null); }}
                      className="hover:bg-slate-50 cursor-pointer transition-colors group"
                    >
                      {/* User */}
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-[12px] font-extrabold flex-shrink-0 ${avatarColor(u.id)}`}>
                            {initials(u.name)}
                          </div>
                          <div>
                            <p className="text-[13px] font-bold text-[#1a2e3f]">{u.name}</p>
                            <p className="text-[11px] text-[#a0a8b3]">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      {/* Role */}
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full ${rm.bg} ${rm.text}`}>
                          {rm.icon} {u.role}
                        </span>
                      </td>
                      {/* Dept */}
                      <td className="px-5 py-3">
                        <span className="text-[12px] font-semibold text-[#404a55]">{u.department}</span>
                      </td>
                      {/* Status */}
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-1 rounded-full ${sm.bg} ${sm.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sm.dot}`} />
                          {u.status}
                        </span>
                      </td>
                      {/* Last active */}
                      <td className="px-5 py-3">
                        <span className="text-[12px] text-[#727780]">{u.lastActive}</span>
                      </td>
                      {/* Requests */}
                      <td className="px-5 py-3">
                        <span className="text-[12px] font-bold text-[#00355f]">{u.requestCount}</span>
                      </td>
                      {/* Actions */}
                      <td className="px-5 py-3" onClick={(e) => e.stopPropagation()}>
                        <div className="relative" ref={openMenu === u.id ? menuRef : undefined}>
                          <button
                            onClick={() => setOpenMenu(openMenu === u.id ? null : u.id)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-[#00355f] transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <MoreVertical size={15} />
                          </button>
                          {openMenu === u.id && (
                            <div className="absolute right-0 top-9 w-44 bg-white border border-slate-200 rounded-xl shadow-lg z-30 overflow-hidden">
                              <button onClick={() => openEdit(u)}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-[12px] font-semibold text-[#1a2e3f] hover:bg-slate-50">
                                <Edit2 size={13} /> Edit User
                              </button>
                              {u.id !== 1 && (
                                <button onClick={() => { toggleStatus(u.id); setOpenMenu(null); }}
                                  className={`w-full flex items-center gap-2 px-4 py-2.5 text-[12px] font-semibold hover:bg-slate-50 ${
                                    u.status === "Active" ? "text-red-600" : "text-emerald-700"
                                  }`}>
                                  {u.status === "Active"
                                    ? <><ToggleLeft size={13} /> Deactivate</>
                                    : <><ToggleRight size={13} /> Activate</>
                                  }
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table footer */}
          <div className="px-5 py-3 border-t border-slate-100 flex justify-between items-center">
            <p className="text-[11px] text-[#a0a8b3]">
              Showing {filtered.length} of {users.length} users
            </p>
            <p className="text-[11px] text-[#a0a8b3]">
              Admin accounts cannot be deactivated via this table.
            </p>
          </div>
        </div>
      </div>

      {/* ── Detail Drawer ──────────────────────────────────────────────────── */}
      {drawer && (
        <UserDrawer
          user={drawer}
          onClose={() => setDrawer(null)}
          onEdit={() => openEdit(drawer)}
          onToggle={() => toggleStatus(drawer.id)}
        />
      )}

      {/* ── Add / Edit Modal ───────────────────────────────────────────────── */}
      {modal && (
        <UserModal
          user={modal === "edit" ? editTarget : null}
          onSave={handleSave}
          onClose={() => { setModal(null); setEditTarget(null); }}
        />
      )}
    </main>
  );
}