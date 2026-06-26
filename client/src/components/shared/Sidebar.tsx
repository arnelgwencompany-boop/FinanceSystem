import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, ArrowLeftRight, FileText,
  CheckCircle, Bell, Settings, FilePlus,
  Users, ChevronRight, LogOut,
} from "lucide-react";
import logo from "../../../public/logo.png";
 
// ─── Types ────────────────────────────────────────────────────────────────────
type Role = "admin" | "supervisor" | "director" | "finance" | "employee";
 
interface MenuItem {
  name: string;
  path: string;
  icon: React.ElementType;
  roles: Role[];
}
 
const ROLE_LABELS: Record<Role, string> = {
  admin:      "Administrator",
  supervisor: "Supervisor",
  director:   "Director",
  finance:    "Finance Officer",
  employee:   "Employee",
};
 
const ROLE_AVATAR_COLOR: Record<Role, string> = {
  admin:      "linear-gradient(135deg,#2563eb,#1d4ed8)",
  supervisor: "linear-gradient(135deg,#7c3aed,#6d28d9)",
  director:   "linear-gradient(135deg,#0891b2,#0e7490)",
  finance:    "linear-gradient(135deg,#059669,#047857)",
  employee:   "linear-gradient(135deg,#d97706,#b45309)",
};
 
const ALL_MENU_ITEMS: MenuItem[] = [
  { name: "Dashboard",        path: "/dashboard",          icon: LayoutDashboard, roles: ["admin",] },
  { name: "Submit Request",   path: "/request",            icon: FilePlus,        roles: ["employee"] },
  { name: "My Approvals",     path: "/supervisor-approval",icon: CheckCircle,     roles: ["supervisor"] },
  { name: "My Approvals",     path: "/director-approval",  icon: CheckCircle,     roles: ["director"] },
  { name: "All Approvals",    path: "/approvals",          icon: CheckCircle,     roles: ["admin"] },
  { name: "Transactions",     path: "/transactions",       icon: ArrowLeftRight,  roles: ["admin",] },
  { name: "Reports",          path: "/reports",            icon: FileText,        roles: ["admin"] },
  { name: "User Management",  path: "/users",              icon: Users,           roles: ["admin"] },
  { name: "Notifications",    path: "/notifications",      icon: Bell,            roles: ["admin","supervisor","director","finance","employee"] },
  { name: "Settings",         path: "/settings",           icon: Settings,        roles: ["admin","supervisor","director","finance","employee"] },
];
 
// ─── Read user from localStorage (set by LoginPage) ──────────────────────────
function getCurrentUser() {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return { name: "Guest", role: "employee" as Role, initials: "G" };
    return JSON.parse(raw) as { name: string; role: Role; initials: string };
  } catch {
    return { name: "Guest", role: "employee" as Role, initials: "G" };
  }
}
 
export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getCurrentUser();
  const { name, role, initials } = user;
 
  const visibleItems = ALL_MENU_ITEMS.filter((item) => item.roles.includes(role));
 
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  };
 
  return (
    <aside
      className="fixed left-0 top-0 h-full w-[270px] flex flex-col z-50"
      style={{ backgroundColor: "#0a1f3c", boxShadow: "4px 0 28px rgba(0,0,0,0.28)" }}
    >
      {/* Top accent stripe */}
      <div className="h-1 w-full flex-shrink-0"
        style={{ background: "linear-gradient(90deg,#2563eb,#60a5fa)" }} />
 
      {/* ── Logo + Brand ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3.5 px-5 py-5 flex-shrink-0">
        <div
          className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: "#ffffff", boxShadow: "0 4px 14px rgba(0,0,0,0.25)" }}
        >
          <img
            src={logo}
            alt="Logo"
            className="w-9 h-9 object-contain"
            onError={(e) => {
              const t = e.currentTarget as HTMLImageElement;
              t.style.display = "none";
              const p = t.parentElement;
              if (p)
                p.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0a1f3c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`;
            }}
          />
        </div>
        <div className="min-w-0">
          <p className="text-[16px] font-extrabold text-white leading-tight tracking-tight">
            Petty Cash System
          </p>
          <p className="text-[11px] font-bold uppercase tracking-widest mt-1"
            style={{ color: "#60a5fa" }}>
            IT Finance Management
          </p>
        </div>
      </div>
 
      {/* ── User card ────────────────────────────────────────────────────── */}
      <div className="mx-4 mb-4 flex-shrink-0">
        <div
          className="flex items-center gap-3 px-4 py-3.5 rounded-2xl"
          style={{
            backgroundColor: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-[14px] font-extrabold text-white"
            style={{ background: ROLE_AVATAR_COLOR[role] }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-bold text-white leading-tight truncate">{name}</p>
            <p className="text-[12px] font-medium mt-0.5 truncate" style={{ color: "#93c5fd" }}>
              {ROLE_LABELS[role]}
            </p>
          </div>
          <span
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{
              backgroundColor: "#4ade80",
              boxShadow: "0 0 7px #4ade80",
              animation: "blink 2s ease-in-out infinite",
            }}
          />
        </div>
      </div>
 
      {/* Divider */}
      <div className="mx-5 mb-3 flex-shrink-0 h-px" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
 
      {/* Section label */}
      <p className="px-5 mb-2 text-[11px] font-bold tracking-widest uppercase flex-shrink-0"
        style={{ color: "rgba(148,163,184,0.6)" }}>
        Main Menu
      </p>
 
      {/* ── Navigation ───────────────────────────────────────────────────── */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {visibleItems.map((item) => {
          const Icon     = item.icon;
          const isActive = location.pathname === item.path;
 
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-150"
              style={
                isActive
                  ? { backgroundColor: "#ffffff", boxShadow: "0 2px 16px rgba(37,99,235,0.18)" }
                  : { backgroundColor: "transparent" }
              }
            >
              <div
                className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
                style={{
                  backgroundColor: isActive ? "#0a1f3c" : "rgba(255,255,255,0.08)",
                }}
              >
                <Icon size={18} color={isActive ? "#60a5fa" : "rgba(255,255,255,0.7)"} />
              </div>
              <span
                className="flex-1 text-[15px] font-semibold"
                style={{ color: isActive ? "#0a1f3c" : "rgba(255,255,255,0.8)" }}
              >
                {item.name}
              </span>
              {isActive && <ChevronRight size={16} color="#2563eb" strokeWidth={2.5} />}
            </NavLink>
          );
        })}
      </nav>
 
      {/* Divider */}
      <div className="mx-5 mt-3 mb-3 flex-shrink-0 h-px" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
 
      {/* ── Sign Out ─────────────────────────────────────────────────────── */}
      <div className="px-3 pb-5 flex-shrink-0">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-150 cursor-pointer"
          style={{
            backgroundColor: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.2)",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.2)";
            e.currentTarget.style.borderColor = "rgba(239,68,68,0.4)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.1)";
            e.currentTarget.style.borderColor = "rgba(239,68,68,0.2)";
          }}
        >
          <div
            className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "rgba(239,68,68,0.15)" }}
          >
            <LogOut size={18} color="#f87171" />
          </div>
          <span className="text-[15px] font-semibold" style={{ color: "#f87171" }}>
            Sign Out
          </span>
        </button>
      </div>
 
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.35} }
        nav::-webkit-scrollbar       { width: 3px; }
        nav::-webkit-scrollbar-track { background: transparent; }
        nav::-webkit-scrollbar-thumb { background: rgba(96,165,250,0.2); border-radius: 99px; }
      `}</style>
    </aside>
  );
}