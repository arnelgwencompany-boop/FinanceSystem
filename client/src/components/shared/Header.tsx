import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell, Search, ChevronDown, Building2, Mail,
  IdCard, Shield,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Role = "admin" | "supervisor" | "director" | "finance" | "employee";

interface CurrentUser {
  name: string;
  role: Role;
  initials: string;
  email?: string;
  department?: string;
  employeeId?: string;
}

const ROLE_LABELS: Record<Role, string> = {
  admin:      "Administrator",
  supervisor: "Supervisor",
  director:   "Director",
  finance:    "Finance Officer",
  employee:   "Employee",
};

const ROLE_AVATAR_COLOR: Record<Role, string> = {
  admin:      "linear-gradient(135deg, #3b82f6, #1d4ed8)",
  supervisor: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
  director:   "linear-gradient(135deg, #06b6d4, #0e7490)",
  finance:    "linear-gradient(135deg, #10b981, #047857)",
  employee:   "linear-gradient(135deg, #f59e0b, #b45309)",
};

function getCurrentUser(): CurrentUser {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return { name: "Guest", role: "employee", initials: "G" };
    return JSON.parse(raw) as CurrentUser;
  } catch {
    return { name: "Guest", role: "employee", initials: "G" };
  }
}

export default function Header() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const { name, role, initials, email, department, employeeId } = user;

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);


  return (
    <header className="fixed top-0 left-[270px] right-0 h-[72px] z-40 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
      {/* ── Left: search ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4 flex-1 max-w-lg">
        <div className="relative w-full group">
          <Search 
            size={18} 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#00355f] transition-colors duration-300" 
          />
          <input
            type="text"
            placeholder="Search requests, employees..."
            className="w-full pl-11 pr-4 py-2.5 bg-slate-100/70 border-transparent rounded-full text-[14px] text-slate-700 placeholder-slate-400 outline-none focus:border-[#00355f]/20 focus:bg-white focus:ring-4 focus:ring-[#00355f]/10 transition-all duration-300 shadow-inner"
          />
        </div>
      </div>

      {/* ── Right: notifications + profile ──────────────────────────────── */}
      <div className="flex items-center gap-5">
        
        {/* Notification bell */}
        <button
          onClick={() => navigate("/notifications")}
          className="relative w-11 h-11 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-[#00355f] transition-all duration-200 active:scale-95"
          aria-label="Notifications"
        >
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>

        {/* Divider */}
        <div className="w-px h-8 bg-slate-200" />

        {/* Profile dropdown trigger */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-3 p-1.5 pr-4 rounded-full hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all duration-200 active:scale-95"
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-bold text-white flex-shrink-0 shadow-sm"
              style={{ background: ROLE_AVATAR_COLOR[role] }}
            >
              {initials}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-[14px] font-semibold text-slate-800 leading-none">{name}</p>
              <p className="text-[12px] text-slate-500 font-medium leading-none mt-1.5">{ROLE_LABELS[role]}</p>
            </div>
            <ChevronDown
              size={16}
              className={`text-slate-400 ml-1 transition-transform duration-300 ${menuOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* ── Dropdown panel ───────────────────────────────────────────── */}
          <div
            className={`absolute right-0 top-[calc(100%+12px)] w-72 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden z-50 transform origin-top-right transition-all duration-200 ease-out ${
              menuOpen ? "opacity-100 scale-100 translate-y-0 visible" : "opacity-0 scale-95 -translate-y-2 invisible"
            }`}
          >
            {/* Header / Hero */}
            <div className="px-6 py-5 bg-gradient-to-br from-[#00355f] to-[#0f4c81] relative overflow-hidden">
              {/* Decorative background circle */}
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
              
              <div className="flex items-center gap-4 relative z-10">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-[16px] font-bold text-white flex-shrink-0 shadow-inner ring-2 ring-white/20"
                  style={{ background: ROLE_AVATAR_COLOR[role] }}
                >
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-[15px] font-bold text-white truncate leading-tight">{name}</p>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-medium mt-1.5 px-2.5 py-1 rounded-full bg-white/15 text-blue-100 backdrop-blur-sm border border-white/10 shadow-sm">
                    <Shield size={10} className="text-blue-200" /> {ROLE_LABELS[role]}
                  </span>
                </div>
              </div>
            </div>

            {/* Account details */}
            {(department || email || employeeId) && (
              <div className="px-3 py-3 space-y-1 border-b border-slate-100">
                {department && (
                  <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-transparent">
                    <div className="w-8 h-8 rounded-full bg-blue-50/50 flex items-center justify-center flex-shrink-0 text-[#00355f]">
                      <Building2 size={15} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 leading-none mb-1">Department</p>
                      <p className="text-[13px] font-medium text-slate-700 truncate">{department}</p>
                    </div>
                  </div>
                )}
                {email && (
                  <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-transparent">
                    <div className="w-8 h-8 rounded-full bg-blue-50/50 flex items-center justify-center flex-shrink-0 text-[#00355f]">
                      <Mail size={15} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 leading-none mb-1">Email</p>
                      <p className="text-[13px] font-medium text-slate-700 truncate">{email}</p>
                    </div>
                  </div>
                )}
                {employeeId && (
                  <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-transparent">
                    <div className="w-8 h-8 rounded-full bg-blue-50/50 flex items-center justify-center flex-shrink-0 text-[#00355f]">
                      <IdCard size={15} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 leading-none mb-1">Employee ID</p>
                      <p className="text-[13px] font-medium font-mono text-slate-700 truncate">{employeeId}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Actions (Added handleLogout binding) */}
          </div>
        </div>
      </div>
    </header>
  );
}